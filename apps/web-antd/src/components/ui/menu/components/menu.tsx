import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { useNamespace } from '@/hooks/ui/useNamespace';
import { useMenuStyle } from '../hooks/useMenu';
import { MenuProvider } from '../hooks/useMenuContext';
import type { MenuItemClicked, MenuItemRegistered, MenuProps } from '../types';
import { flattedChildren } from '../utils';

/**
 * DefaultMenuProps - 菜单组件默认属性配置
 * Default props for Menu component
 */
const defaultProps: MenuProps = {
  accordion: true,
  collapse: false,
  mode: 'vertical',
  rounded: true,
  theme: 'dark',
  scrollToActive: false,
};

/**
 * MenuComponentProps - React 版菜单组件属性
 * React version of Menu component props
 */
interface MenuComponentProps extends MenuProps {
  /** 菜单子节点 / menu children nodes */
  children?: ReactNode;
  /** 菜单点击回调 / menu item click callback */
  onSelect?: (path: string, parentPaths: string[]) => void;
}

/**
 * Menu - 自定义菜单组件（React 版本）
 * Menu - custom menu component (React version)
 */
export function Menu(props: MenuComponentProps) {
  /** 合并默认属性与外部属性 / merge default props and external props */
  const mergedProps = useMemo<MenuComponentProps>(
    () => ({
      ...defaultProps,
      ...props,
    }),
    [
      props.accordion,
      props.collapse,
      props.collapseShowTitle,
      props.defaultActive,
      props.defaultOpeneds,
      props.mode,
      props.rounded,
      props.scrollToActive,
      props.theme,
    ],
  );
  /** BEM 命名工具 / BEM namespace helpers */
  const { b, is } = useNamespace('menu');
  /** 菜单样式（CSS 变量）/ menu style (CSS variables) */
  const menuStyle = useMenuStyle();
  /** 菜单根节点引用 / menu root element ref */
  const menuRef = useRef<HTMLUListElement | null>(null);
  /** 当前展开菜单列表 / current opened menus */
  const [openedMenus, setOpenedMenus] = useState<string[]>(() =>
    props.defaultOpeneds && !props.collapse ? [...props.defaultOpeneds] : [],
  );
  /** 当前激活菜单路径 / current active menu path */
  const [activePath, setActivePath] = useState<string | undefined>(props.defaultActive);
  /** 已注册菜单项集合 / registered menu items map */
  const [items, setItems] = useState<Record<string, MenuItemRegistered>>({});
  /** 已注册子菜单集合 / registered sub menus map */
  const [subMenus, setSubMenus] = useState<Record<string, MenuItemRegistered>>({});
  /** 横向模式下“更多”切分索引 / slice index for horizontal "more" mode */
  const [sliceIndex, setSliceIndex] = useState<number>(-1);

  /** 扁平化 children，便于统一渲染 / flatten children for rendering */
  const flatChildren = useMemo<ReactNode[]>(() => {
    return flattedChildren(props.children as ReactNode);
  }, [props.children]);

  /**
   * isMenuPopup - 是否以弹出形式展示菜单（折叠或横向）
   * isMenuPopup - whether menu is displayed as popup (collapse or horizontal)
   */
  const isMenuPopup = useMemo<boolean>(
    () =>
      mergedProps.mode === 'horizontal' ||
      (mergedProps.mode === 'vertical' && !!mergedProps.collapse),
    [mergedProps.collapse, mergedProps.mode],
  );

  /**
   * calcMenuItemWidth - 计算单个菜单项的宽度（含左右 margin）
   * calcMenuItemWidth - compute single menu item width (with horizontal margin)
   */
  const calcMenuItemWidth = useCallback((menuItem: HTMLElement) => {
    const computedStyle = getComputedStyle(menuItem);
    const marginLeft = Number.parseInt(computedStyle.marginLeft, 10) || 0;
    const marginRight = Number.parseInt(computedStyle.marginRight, 10) || 0;
    return menuItem.offsetWidth + marginLeft + marginRight || 0;
  }, []);

  /**
   * calcSliceIndex - 计算横向菜单“更多”切分索引
   * calcSliceIndex - compute slice index for horizontal menu "more" slot
   */
  const calcSliceIndex = useCallback(() => {
    const menuElement = menuRef.current;
    if (!menuElement) {
      return -1;
    }

    const itemsElements = Array.from(menuElement.childNodes).filter(
      (node) => node.nodeName !== '#comment' && (node.nodeName !== '#text' || node.nodeValue),
    ) as HTMLElement[];

    const moreItemWidth = 46;
    const computedMenuStyle = getComputedStyle(menuElement);

    const paddingLeft = Number.parseInt(computedMenuStyle.paddingLeft, 10) || 0;
    const paddingRight = Number.parseInt(computedMenuStyle.paddingRight, 10) || 0;
    const menuWidth = menuElement.clientWidth - paddingLeft - paddingRight || 0;

    let calcWidth = 0;
    let resolvedSliceIndex = 0;

    itemsElements.forEach((item, index) => {
      calcWidth += calcMenuItemWidth(item);
      if (calcWidth <= menuWidth - moreItemWidth) {
        resolvedSliceIndex = index + 1;
      }
    });

    return resolvedSliceIndex === itemsElements.length ? -1 : resolvedSliceIndex;
  }, [calcMenuItemWidth]);

  /**
   * updateSliceIndex - 更新横向菜单“更多”切分索引
   * updateSliceIndex - update slice index for horizontal menu "more" slot
   */
  const updateSliceIndex = useCallback(() => {
    setSliceIndex((previous) => {
      const next = calcSliceIndex();
      if (next === previous) {
        return previous;
      }
      return next;
    });
  }, [calcSliceIndex]);

  /**
   * getActivePaths - 获取当前激活菜单的父级路径列表
   * getActivePaths - get parent path list of current active menu
   */
  const getActivePaths = useCallback((): string[] => {
    const activeItem = activePath && items[activePath];

    if (!activeItem || mergedProps.mode === 'horizontal' || mergedProps.collapse) {
      return [];
    }

    return activeItem.parentPaths;
  }, [activePath, items, mergedProps.collapse, mergedProps.mode]);

  /**
   * addMenuItem - 注册菜单项
   * addMenuItem - register menu item
   */
  const addMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems((previous) => ({
      ...previous,
      [item.path]: item,
    }));
  }, []);

  /**
   * removeMenuItem - 注销菜单项
   * removeMenuItem - unregister menu item
   */
  const removeMenuItem = useCallback((item: MenuItemRegistered) => {
    setItems((previous) => {
      const next = { ...previous };
      Reflect.deleteProperty(next, item.path);
      return next;
    });
  }, []);

  /**
   * addSubMenu - 注册子菜单
   * addSubMenu - register sub menu
   */
  const addSubMenu = useCallback((subMenu: MenuItemRegistered) => {
    setSubMenus((previous) => ({
      ...previous,
      [subMenu.path]: subMenu,
    }));
  }, []);

  /**
   * removeSubMenu - 注销子菜单
   * removeSubMenu - unregister sub menu
   */
  const removeSubMenu = useCallback((subMenu: MenuItemRegistered) => {
    setSubMenus((previous) => {
      const next = { ...previous };
      Reflect.deleteProperty(next, subMenu.path);
      return next;
    });
  }, []);

  /**
   * close - 关闭指定路径的菜单
   * close - close menu with specified path
   */
  const close = useCallback((path: string) => {
    setOpenedMenus((previous) => {
      const index = previous.indexOf(path);

      if (index === -1) {
        return previous;
      }

      const next = [...previous];
      next.splice(index, 1);
      return next;
    });
  }, []);

  /**
   * closeMenu - 关闭、折叠菜单
   * closeMenu - close or collapse menu
   */
  const closeMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      setOpenedMenus((previous) => {
        let next = previous;

        if (mergedProps.accordion) {
          const parentPathsFromSubMenu = subMenus[path]?.parentPaths ?? [];
          next = parentPathsFromSubMenu.length > 0 ? [...parentPathsFromSubMenu] : [];
        } else {
          next = [...previous];
        }

        const index = next.indexOf(path);
        if (index !== -1) {
          next.splice(index, 1);
        }

        return next;
      });

      // 这里原本通过 emit('close', path, parentPaths) 对外抛出事件
      // in Vue version it emitted `close` event here
      void parentPaths;
    },
    [mergedProps.accordion, subMenus],
  );

  /**
   * openMenu - 展开菜单（支持手风琴模式）
   * openMenu - open menu (supports accordion mode)
   */
  const openMenu = useCallback(
    (path: string, parentPaths: string[]) => {
      setOpenedMenus((previous) => {
        if (previous.includes(path)) {
          return previous;
        }

        if (!mergedProps.accordion) {
          return [...previous, path];
        }

        const activeParentPaths = getActivePaths();
        const resolvedParentPaths = activeParentPaths.includes(path)
          ? activeParentPaths
          : parentPaths;

        const filtered = previous.filter((itemPath) => resolvedParentPaths.includes(itemPath));

        return [...filtered, path];
      });

      // 这里原本通过 emit('open', path, parentPaths) 对外抛出事件
      // in Vue version it emitted `open` event here
    },
    [getActivePaths, mergedProps.accordion],
  );

  /**
   * initMenu - 默认展开当前激活菜单的所有父级子菜单
   * initMenu - expand all parent sub menus of active menu by default
   */
  const initMenu = useCallback(() => {
    const parentPaths = getActivePaths();

    parentPaths.forEach((path) => {
      const subMenu = subMenus[path];
      if (subMenu) {
        openMenu(path, subMenu.parentPaths);
      }
    });
  }, [getActivePaths, openMenu, subMenus]);

  /**
   * updateActiveName - 更新当前激活菜单路径
   * updateActiveName - update current active menu path
   */
  const updateActiveName = useCallback(
    (value: string) => {
      const itemsInData = items;
      const item =
        itemsInData[value] ||
        (activePath && itemsInData[activePath]) ||
        (mergedProps.defaultActive && itemsInData[mergedProps.defaultActive]) ||
        undefined;

      setActivePath(item ? item.path : value);
    },
    [activePath, items, mergedProps.defaultActive],
  );

  /**
   * handleMenuItemClick - 处理菜单项点击事件
   * handleMenuItemClick - handle menu item click event
   */
  const handleMenuItemClick = useCallback(
    (data: MenuItemClicked) => {
      const { collapse, mode } = mergedProps;

      if (mode === 'horizontal' || collapse) {
        setOpenedMenus([]);
      }

      const { parentPaths, path } = data;
      if (!path || !parentPaths) {
        return;
      }

      setActivePath(path);

      // 这里原本通过 emit('select', path, parentPaths) 对外抛出事件
      // in Vue version it emitted `select` event here
      mergedProps?.onSelect?.(path, parentPaths);
    },
    [mergedProps],
  );

  /**
   * handleSubMenuClick - 处理子菜单点击（展开/收起）
   * handleSubMenuClick - handle sub menu click (open/close)
   */
  const handleSubMenuClick = useCallback(
    ({ parentPaths, path }: MenuItemRegistered) => {
      const isOpened = openedMenus.includes(path);

      if (isOpened) {
        closeMenu(path, parentPaths);
      } else {
        openMenu(path, parentPaths);
      }
    },
    [closeMenu, openMenu, openedMenus],
  );

  /**
   * enableScroll - 是否启用滚动到激活项
   * enableScroll - whether scroll to active item is enabled
   */
  const enableScroll = useMemo(
    () => !!mergedProps.scrollToActive && mergedProps.mode === 'vertical' && !mergedProps.collapse,
    [mergedProps.collapse, mergedProps.mode, mergedProps.scrollToActive],
  );

  /**
   * scrollToActiveItem - 滚动到当前激活菜单项
   * scrollToActiveItem - scroll to current active menu item
   */
  const scrollToActiveItem = useCallback(() => {
    if (!enableScroll || !activePath) {
      return;
    }

    const activeElement = document.querySelector<HTMLElement>(`[data-menu-path="${activePath}"]`);

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activePath, enableScroll]);

  /**
   * menuContextValue - 提供给子组件的菜单上下文值
   * menuContextValue - menu context value provided to children
   */
  const menuContextValue = useMemo(
    () => ({
      activePath,
      addMenuItem,
      addSubMenu,
      closeMenu,
      handleMenuItemClick,
      handleSubMenuClick,
      isMenuPopup,
      items,
      openedMenus,
      openMenu,
      props: {
        accordion: mergedProps.accordion,
        collapse: mergedProps.collapse,
        collapseShowTitle: mergedProps.collapseShowTitle,
        defaultActive: mergedProps.defaultActive,
        defaultOpeneds: mergedProps.defaultOpeneds,
        mode: mergedProps.mode,
        rounded: mergedProps.rounded,
        scrollToActive: mergedProps.scrollToActive,
        theme: mergedProps.theme,
      },
      removeMenuItem,
      removeSubMenu,
      subMenus,
      theme: mergedProps.theme ?? 'dark',
    }),
    [
      activePath,
      addMenuItem,
      addSubMenu,
      closeMenu,
      handleMenuItemClick,
      handleSubMenuClick,
      isMenuPopup,
      items,
      mergedProps.accordion,
      mergedProps.collapse,
      mergedProps.collapseShowTitle,
      mergedProps.defaultActive,
      mergedProps.defaultOpeneds,
      mergedProps.mode,
      mergedProps.rounded,
      mergedProps.scrollToActive,
      mergedProps.theme,
      openedMenus,
      openMenu,
      removeMenuItem,
      removeSubMenu,
      subMenus,
    ],
  );

  /**
   * 监听折叠状态变化，折叠菜单时清空已展开菜单
   * watch collapse state, clear opened menus when collapsed
   */
  useEffect(() => {
    if (mergedProps.collapse) {
      setOpenedMenus([]);
    }
  }, [mergedProps.collapse]);

  /**
   * 监听菜单项变化，初始化默认展开菜单
   * watch menu items change and initialize opened menus
   */
  useEffect(() => {
    initMenu();
  }, [initMenu]);

  /**
   * 监听 defaultActive 变化，更新当前激活菜单
   * watch defaultActive change and update active menu
   */
  useEffect(() => {
    const currentActive = mergedProps.defaultActive ?? '';

    if (!currentActive) {
      return;
    }

    if (!items[currentActive]) {
      setActivePath('');
    }

    updateActiveName(currentActive);
  }, [items, mergedProps.defaultActive, updateActiveName]);

  /**
   * 监听 activePath 变化，自动滚动到激活项
   * watch activePath change and scroll to active item automatically
   */
  useEffect(() => {
    if (!enableScroll) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToActiveItem();
    }, 320);

    return () => {
      window.clearTimeout(timer);
    };
  }, [enableScroll, scrollToActiveItem, activePath]);

  /**
   * 监听模式变化，横向模式下通过 ResizeObserver 计算“更多”切分索引
   * watch mode change, use ResizeObserver to compute "more" slice index in horizontal mode
   */
  useEffect(() => {
    if (mergedProps.mode !== 'horizontal') {
      setSliceIndex(-1);
      return;
    }

    const menuElement = menuRef.current;

    if (!menuElement || typeof ResizeObserver === 'undefined') {
      return;
    }

    updateSliceIndex();

    const resizeObserver = new ResizeObserver(() => {
      updateSliceIndex();
    });

    resizeObserver.observe(menuElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mergedProps.mode, updateSliceIndex]);

  /**
   * 计算横向模式下的插槽分布（默认/更多）
   * compute slot distribution for horizontal mode (default/more)
   */
  const slotInfo = useMemo(() => {
    if (mergedProps.mode !== 'horizontal') {
      return {
        showSlotMore: false,
        slotDefault: flatChildren,
        slotMore: [] as ReactNode[],
      };
    }

    const slotDefault = sliceIndex === -1 ? flatChildren : flatChildren.slice(0, sliceIndex);

    const slotMore = sliceIndex === -1 ? [] : flatChildren.slice(sliceIndex);

    return {
      showSlotMore: slotMore.length > 0,
      slotDefault,
      slotMore,
    };
  }, [flatChildren, mergedProps.mode, sliceIndex]);

  /** 计算菜单根元素的类名 / compute root menu className */
  const menuClassName = useMemo<string>(() => {
    const mode = mergedProps.mode ?? 'vertical';
    const theme = mergedProps.theme ?? 'dark';
    const rounded = mergedProps.rounded ?? true;
    const collapse = mergedProps.collapse ?? false;

    return [
      theme,
      b(),
      is(mode, true),
      is(theme, true),
      is('rounded', rounded),
      is('collapse', collapse),
      is('menu-align', mode === 'horizontal'),
    ]
      .filter(Boolean)
      .join(' ');
  }, [b, is, mergedProps.collapse, mergedProps.mode, mergedProps.rounded, mergedProps.theme]);

  return (
    <MenuProvider value={menuContextValue}>
      <ul ref={menuRef} className={menuClassName} style={menuStyle as CSSProperties}>
        {mergedProps.mode === 'horizontal' && slotInfo.showSlotMore ? (
          <>
            {slotInfo.slotDefault}
            {/* “更多”子菜单结构预留 / reserved "more" submenu structure */}
            <li className="nova-menu__more">
              <button type="button" className="nova-menu__more-button">
                <NovaSvgIcon icon="ri:more-2-fill" />
              </button>
              {slotInfo.slotMore}
            </li>
          </>
        ) : (
          flatChildren
        )}
      </ul>
    </MenuProvider>
  );
}
