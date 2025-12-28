import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import type { RouteObject } from 'react-router';
import { matchRoutes, useLocation } from 'react-router';
import { Menu, MenuItem, SubMenu } from '@/components/ui/menu';
import { handleMenuJump } from '@/lib/navigation/jump';
import { routes } from '@/router/routes';
import type { AppRouteRecord } from '@/types';

/**
 * NovaHorizontalMenuProps - 顶部水平菜单组件属性
 * NovaHorizontalMenuProps - props of top horizontal menu component
 */
interface NovaHorizontalMenuProps {
  /** list - 菜单路由数据列表 / list of menu route records */
  list: AppRouteRecord[];
}

/**
 * buildMenuNodes - 将路由数据转换为菜单渲染节点
 * buildMenuNodes - convert route records to menu render nodes
 */
function buildMenuNodes(menus: AppRouteRecord[]): ReactNode[] {
  /** visibleMenus - 过滤后的可见菜单列表 / filtered visible menu list */
  const visibleMenus = menus.filter((item) => !item.meta?.isHide);

  return visibleMenus
    .map((item) => {
      /** children - 子级菜单列表 / children menu list */
      const children = (item.children ?? []).filter((child) => !child.meta?.isHide);
      /** hasChildren - 是否存在子级菜单 / whether menu has children */
      const hasChildren = children.length > 0;
      /** path - 当前菜单路径标识 / current menu path identifier */
      const path = item.path || item.id || '';

      if (!path) {
        return null;
      }

      if (!hasChildren) {
        return (
          <MenuItem key={path} path={path} icon={item.meta.icon}>
            <span>{item.meta.title}</span>
          </MenuItem>
        );
      }

      return (
        <SubMenu key={path} path={path} icon={item.meta.icon}>
          <span>{item.meta.title}</span>
          {buildMenuNodes(children)}
        </SubMenu>
      );
    })
    .filter(Boolean) as ReactNode[];
}

/**
 * NovaHorizontalMenu - 顶部水平菜单组件
 * NovaHorizontalMenu - top horizontal menu component
 */
export function NovaHorizontalMenu(props: NovaHorizontalMenuProps) {
  /** location - 当前路由位置信息 / current route location info */
  const location = useLocation();

  /** matches - 当前路由匹配结果列表 / current matched route records */
  const matches = useMemo(
    () => matchRoutes(routes as unknown as RouteObject[], location),
    [location],
  );

  /** activePath - 当前激活菜单路径 / current active menu path */
  const activePath = useMemo(() => {
    const currentRoute = matches?.[matches.length - 1]?.route as any;
    return currentRoute?.meta?.activePath || location.pathname;
  }, [matches, location.pathname]);

  /** menuNodes - 顶部菜单渲染节点列表 / rendered nodes for top menu */
  const menuNodes = useMemo<ReactNode[]>(() => buildMenuNodes(props.list), [props.list]);

  /**
   * handleSelect - 菜单项选择回调
   * handleSelect - callback when menu item is selected
   */
  const handleSelect = useCallback(
    (path: string, _parentPaths: string[]) => {
      /** findByPath - 递归根据路径查找菜单项 / recursively find menu item by path */
      const findByPath = (menus: AppRouteRecord[]): AppRouteRecord | undefined => {
        for (const menu of menus) {
          if (menu.path === path) {
            return menu;
          }
          if (menu.children?.length) {
            const child = findByPath(menu.children);
            if (child) {
              return child;
            }
          }
        }
        return undefined;
      };

      const target = findByPath(props.list);
      if (!target) {
        return;
      }
      handleMenuJump(target);
    },
    [props.list],
  );

  return (
    <div className="flex-1 overflow-hidden">
      <Menu theme="dark" mode="horizontal" defaultActive={activePath} onSelect={handleSelect}>
        {menuNodes}
      </Menu>
    </div>
  );
}
