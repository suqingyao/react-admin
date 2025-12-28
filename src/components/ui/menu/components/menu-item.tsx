import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { useNamespace } from '@/hooks/ui/useNamespace';
import { useMenu } from '../hooks/useMenu';
import { useMenuContext, useSubMenuPathContext } from '../hooks/useMenuContext';
import type { MenuItemProps, MenuItemRegistered } from '../types';
import { MenuBadge } from './menu-badge';

/**
 * MenuItemComponentProps - 菜单项组件属性
 * MenuItemComponentProps - props of menu item component
 */
interface MenuItemComponentProps extends MenuItemProps {
  /** children - 菜单项内容插槽 / menu item children content */
  children?: ReactNode;
}

/**
 * MenuItem - 自定义菜单项组件（React 版本）
 * MenuItem - custom menu item component (React version)
 */
export function MenuItem(props: MenuItemComponentProps) {
  /** nsMenuItem - 菜单项命名空间 / namespace helper for menu-item */
  const nsMenuItem = useNamespace('menu-item');
  /** nsMenu - 菜单命名空间 / namespace helper for menu */
  const nsMenu = useNamespace('menu');
  /** rootMenu - 根菜单上下文 / root menu context */
  const rootMenu = useMenuContext();
  /** subMenuPathContext - 父级菜单路径上下文 / parent menu path context */
  const subMenuPathContext = useSubMenuPathContext();

  /** useMenuResult - 使用 useMenu 计算父级路径链路 / use useMenu to compute parent paths */
  const { parentPaths } = useMenu({
    path: props.path,
    parentPaths: subMenuPathContext.parentPaths,
  });

  /** active - 是否为激活状态 / whether current item is active */
  const active = useMemo(
    () => props.path === rootMenu.activePath,
    [props.path, rootMenu.activePath],
  );

  /** menuIcon - 当前显示图标 / current icon to display */
  const menuIcon = useMemo(
    () => (active ? props.activeIcon || props.icon : props.icon),
    [active, props.activeIcon, props.icon],
  );

  /** isTopLevelMenuItem - 是否为一级菜单项 / whether item is top level */
  const isTopLevelMenuItem = useMemo(() => {
    return subMenuPathContext.level === 1;
  }, [subMenuPathContext.level]);

  /** collapseShowTitle - 折叠时是否显示标题 / whether show title when collapsed */
  const collapseShowTitle = useMemo(
    () => !!rootMenu.props.collapseShowTitle && isTopLevelMenuItem && !!rootMenu.props.collapse,
    [isTopLevelMenuItem, rootMenu.props.collapse, rootMenu.props.collapseShowTitle],
  );

  /** showTooltip - 是否显示 tooltip（React 版本暂不实现，统一为 false） */
  const showTooltip = false;

  /** item - 注册到菜单中的菜单项数据 / menu item data registered to root menu */
  const item: MenuItemRegistered = useMemo(
    () => ({
      active,
      parentPaths,
      path: props.path || '',
    }),
    [active, parentPaths, props.path],
  );

  /**
   * handleClick - 菜单项点击事件处理
   * handleClick - handle menu item click event
   */
  const handleClick = (event: MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    if (props.disabled) {
      return;
    }
    rootMenu.handleMenuItemClick({
      parentPaths,
      path: props.path,
    });
  };

  /**
   * 副作用：组件挂载时注册菜单项，卸载时移除菜单项
   * side effect: register menu item on mount and unregister on unmount
   */
  useEffect(() => {
    rootMenu.addMenuItem(item);
    return () => {
      rootMenu.removeMenuItem(item);
    };
  }, [item, rootMenu]);

  /** itemClassName - 菜单项根元素类名 / class name of menu item root element */
  const itemClassName = useMemo(
    () =>
      [
        rootMenu.theme,
        nsMenuItem.b(),
        nsMenuItem.is('active', active),
        nsMenuItem.is('disabled', !!props.disabled),
        nsMenuItem.is('collapse-show-title', collapseShowTitle),
      ]
        .filter(Boolean)
        .join(' '),
    [active, collapseShowTitle, nsMenuItem, props.disabled, rootMenu.theme],
  );

  return (
    <li className={itemClassName} data-menu-path={props.path} onClick={handleClick}>
      {showTooltip ? null : (
        <div className={nsMenuItem.e('content')}>
          {rootMenu.props.mode !== 'horizontal' && (
            <MenuBadge
              className="right-2"
              badge={props.badge}
              badgeType={props.badgeType}
              badgeVariants={props.badgeVariants}
            />
          )}
          {menuIcon && (
            <NovaSvgIcon
              className={nsMenu.e('icon')}
              icon={typeof menuIcon === 'string' ? menuIcon : ''}
            />
          )}
          {props.children}
          {collapseShowTitle && <span className={nsMenu.e('name')}>{props.children}</span>}
        </div>
      )}
    </li>
  );
}

export type { MenuItemComponentProps };
