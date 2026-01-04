import {
  Children,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNamespace } from '@/hooks/ui/useNamespace';
import { useMenu, useMenuStyle } from '../hooks/useMenu';
import {
  SubMenuPathProvider,
  useMenuContext,
  useSubMenuPathContext,
} from '../hooks/useMenuContext';
import type { MenuItemRegistered, MenuProvider, SubMenuProps } from '../types';
import { SubMenuContent } from './sub-menu-content';

/**
 * SubMenuComponentProps - 子菜单组件属性
 * SubMenuComponentProps - props of submenu component
 */
interface SubMenuComponentProps extends SubMenuProps {
  /** children - 子菜单内容插槽 / submenu children content */
  children?: ReactNode;
  /** isSubMenuMore - 是否为“更多”子菜单 / whether submenu is used as "more" menu */
  isSubMenuMore?: boolean;
}

/**
 * SubMenu - 自定义子菜单组件（React 版本）
 * SubMenu - custom submenu component (React version)
 */
export function SubMenu(props: SubMenuComponentProps) {
  /** pathContext - 父级路径上下文 / parent path context */
  const pathContext = useSubMenuPathContext();
  /** menuNamespace - 子菜单命名空间 / namespace helper for sub-menu */
  const menuNamespace = useNamespace('sub-menu');
  /** nsMenu - 菜单命名空间 / namespace helper for menu */
  const nsMenu = useNamespace('menu');
  /** rootMenu - 根菜单上下文 / root menu context */
  const rootMenu = useMenuContext();
  /** subMenuStyle - 子菜单样式（层级相关）/ submenu style with level variable */
  const subMenuStyle = useMenuStyle({
    addSubMenu: () => {},
    level: pathContext.level + 1,
    mouseInChild: { current: false } as unknown as MenuProvider['items'],
    removeSubMenu: () => {},
  });

  /** mouseInChild - 鼠标是否在子级中 / whether mouse is inside child menus */
  const [mouseInChild, setMouseInChild] = useState(false);
  /** itemsRef - 当前子菜单下的菜单项集合 / items under current submenu */
  const itemsRef = useRef<MenuProvider['items']>({});
  /** subMenusRef - 当前子菜单下的子菜单集合 / submenus under current submenu */
  const subMenusRef = useRef<MenuProvider['subMenus']>({});
  /** timerRef - 悬停展开/关闭的定时器 / timer for hover open/close */
  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const childrenArray = useMemo(() => Children.toArray(props.children), [props.children]);
  const titleNode = childrenArray[0] ?? null;
  const submenuChildren = useMemo(
    () => (childrenArray.length > 1 ? childrenArray.slice(1) : []),
    [childrenArray],
  );

  /** useMenuResult - 使用 useMenu 计算父级路径链路 / use useMenu to compute parent paths */
  const { parentPaths } = useMenu({
    path: props.path,
    parentPaths: pathContext.parentPaths,
  });

  /** opened - 当前子菜单是否展开 / whether submenu is opened */
  const opened = useMemo(
    () => rootMenu.openedMenus.includes(props.path),
    [props.path, rootMenu.openedMenus],
  );

  /** mode - 菜单模式 / menu mode */
  const mode = useMemo(() => rootMenu.props.mode ?? 'vertical', [rootMenu.props.mode]);
  /** rounded - 是否圆角风格 / whether rounded style is enabled */
  const rounded = useMemo(() => !!rootMenu.props.rounded, [rootMenu.props.rounded]);

  /** currentLevel - 当前子菜单层级 / current submenu level */
  const currentLevel = useMemo(() => pathContext.level + 1, [pathContext.level]);

  /** isFirstLevel - 是否为第一层子菜单 / whether submenu is first level */
  const isFirstLevel = useMemo(() => currentLevel === 1, [currentLevel]);

  /** active - 子树中是否存在激活项 / whether there is active item in subtree */
  const active = useMemo(() => {
    let isActive = false;
    Object.values(itemsRef.current).forEach((item) => {
      if (item.active) {
        isActive = true;
      }
    });
    Object.values(subMenusRef.current).forEach((item) => {
      if (item.active) {
        isActive = true;
      }
    });
    return isActive;
  }, [itemsRef.current, subMenusRef.current]);

  /**
   * addSubMenu - 注册子菜单项
   * addSubMenu - register submenu item
   */
  const addSubMenu = (subMenuItem: MenuItemRegistered) => {
    subMenusRef.current[subMenuItem.path] = subMenuItem;
  };

  /**
   * removeSubMenu - 注销子菜单项
   * removeSubMenu - unregister submenu item
   */
  const removeSubMenu = (subMenuItem: MenuItemRegistered) => {
    // biome-ignore lint/performance/noDelete: 需要与 Vue 版本行为对应
    delete subMenusRef.current[subMenuItem.path];
  };

  /**
   * handleClick - 点击切换子菜单展开/收起
   * handleClick - toggle submenu open/close on click
   */
  const handleClick = () => {
    const isVertical = mode === 'vertical';
    if (props.disabled || (rootMenu.props.collapse && isVertical) || mode === 'horizontal') {
      return;
    }
    rootMenu.handleSubMenuClick({
      active,
      parentPaths,
      path: props.path,
    });
  };

  /**
   * handleMouseenter - 处理鼠标进入事件（用于折叠/横向模式）
   * handleMouseenter - handle mouse enter event (for collapse/horizontal mode)
   */
  const handleMouseenter = (
    event: FocusEvent<HTMLLIElement> | MouseEvent<HTMLLIElement>,
    showTimeout = 300,
  ) => {
    if (event.type === 'focus') {
      return;
    }

    if ((!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') || props.disabled) {
      setMouseInChild(true);
      return;
    }

    setMouseInChild(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      rootMenu.openMenu(props.path, parentPaths);
    }, showTimeout);
  };

  /**
   * handleMouseleave - 处理鼠标离开事件
   * handleMouseleave - handle mouse leave event
   */
  const handleMouseleave = () => {
    if (!rootMenu.props.collapse && rootMenu.props.mode === 'vertical') {
      setMouseInChild(false);
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setMouseInChild(false);

    timerRef.current = setTimeout(() => {
      if (!mouseInChild) {
        rootMenu.closeMenu(props.path, parentPaths);
      }
    }, 300);
  };

  /** menuIcon - 当前显示的子菜单图标 / current icon of submenu */
  const menuIcon = useMemo(
    () => (active ? props.activeIcon || props.icon : props.icon),
    [active, props.activeIcon, props.icon],
  );

  /** item - 注册到根菜单的子菜单数据 / submenu data registered to root menu */
  const item: MenuItemRegistered = useMemo(
    () => ({
      active,
      parentPaths,
      path: props.path,
    }),
    [active, parentPaths, props.path],
  );

  /**
   * 副作用：挂载时注册子菜单，卸载时注销
   * side effect: register submenu on mount and unregister on unmount
   */
  useEffect(() => {
    rootMenu.addSubMenu(item);
    return () => {
      rootMenu.removeSubMenu(item);
    };
  }, [item, rootMenu.addSubMenu, rootMenu.removeSubMenu]);

  /** liClassName - 子菜单根元素类名 / class name of submenu root element */
  const liClassName = useMemo(
    () =>
      [
        menuNamespace.b(),
        menuNamespace.is('opened', opened),
        menuNamespace.is('active', active),
        menuNamespace.is('disabled', !!props.disabled),
      ]
        .filter(Boolean)
        .join(' '),
    [active, menuNamespace, opened, props.disabled],
  );

  const shouldRenderChildren = useMemo(
    () => !rootMenu.isMenuPopup || opened,
    [opened, rootMenu.isMenuPopup],
  );

  return (
    <li
      className={liClassName}
      onFocus={(event) => handleMouseenter(event)}
      onMouseEnter={(event) => handleMouseenter(event)}
      onMouseLeave={() => handleMouseleave()}>
      <SubMenuContent
        icon={menuIcon}
        isMenuMore={props.isSubMenuMore}
        isTopLevelMenuSubmenu={isFirstLevel}
        level={currentLevel}
        path={props.path}
        title={titleNode}></SubMenuContent>
      {shouldRenderChildren && (
        <ul
          className={[
            nsMenu.b(),
            menuNamespace.is('rounded', rounded),
            menuNamespace.is('popup', rootMenu.isMenuPopup),
          ]
            .filter(Boolean)
            .join(' ')}
          style={subMenuStyle as any}>
          <SubMenuPathProvider level={currentLevel} parentPaths={parentPaths}>
            {opened && submenuChildren}
          </SubMenuPathProvider>
        </ul>
      )}
    </li>
  );
}

export type { SubMenuComponentProps };
