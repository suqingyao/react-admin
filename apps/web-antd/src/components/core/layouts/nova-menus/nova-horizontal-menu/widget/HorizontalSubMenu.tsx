import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Menu, MenuItem, SubMenu } from '@/components/ui/menu';
import { handleMenuJump } from '@/lib/navigation/jump';
import type { AppRouteRecord } from '@/types';

/**
 * HorizontalSubMenuProps - 顶部菜单子级容器组件属性
 * HorizontalSubMenuProps - props of horizontal submenu container component
 */
interface HorizontalSubMenuProps {
  /** item - 顶部菜单对应的路由项 / route record of top menu item */
  item: AppRouteRecord;
  /** theme - 菜单主题配置对象 / menu theme config object */
  theme: object;
  /** isMobile - 是否为移动端模式 / whether in mobile mode */
  isMobile: boolean;
  /** level - 当前子菜单层级 / current submenu level */
  level: number;
  /** onClose - 菜单关闭回调 / callback when menu should be closed */
  onClose?: () => void;
}

/**
 * resolveMenuTheme - 解析菜单主题模式
 * resolveMenuTheme - resolve menu theme mode from theme object
 */
function resolveMenuTheme(theme: object): 'dark' | 'light' {
  /** themeAny - 任意类型主题对象 / theme object with any shape */
  const themeAny = theme as any;
  const rawTheme = String(themeAny?.theme ?? '').toLowerCase();
  if (rawTheme.includes('dark')) {
    return 'dark';
  }
  return 'light';
}

/**
 * buildChildrenMenuNodes - 构建子级菜单渲染节点
 * buildChildrenMenuNodes - build render nodes for submenu children
 */
function buildChildrenMenuNodes(children: AppRouteRecord[]): ReactNode[] {
  /** visibleChildren - 过滤后的可见子菜单列表 / filtered visible children list */
  const visibleChildren = children.filter((child) => !child.meta?.isHide);

  return visibleChildren
    .map((child) => {
      /** grandChildren - 孙级菜单列表 / grand-children menu list */
      const grandChildren = (child.children ?? []).filter((item) => !item.meta?.isHide);
      /** hasGrandChildren - 是否存在孙级菜单 / whether grand-children exist */
      const hasGrandChildren = grandChildren.length > 0;
      /** path - 当前子菜单路径标识 / current submenu path identifier */
      const path = child.path || child.id || '';

      if (!path) {
        return null;
      }

      if (!hasGrandChildren) {
        return (
          <MenuItem key={path} path={path} icon={child.meta.icon}>
            <span>{child.meta.title}</span>
          </MenuItem>
        );
      }

      return (
        <SubMenu key={path} path={path} icon={child.meta.icon}>
          <span>{child.meta.title}</span>
          {buildChildrenMenuNodes(grandChildren)}
        </SubMenu>
      );
    })
    .filter(Boolean) as ReactNode[];
}

/**
 * HorizontalSubMenu - 顶部菜单下钻子菜单容器
 * HorizontalSubMenu - submenu container for top horizontal menu
 */
export function HorizontalSubMenu(props: HorizontalSubMenuProps) {
  /** location - 当前路由位置 / current route location */
  const location = useLocation();

  /** filteredChildren - 过滤后的可见子菜单列表 / filtered visible children list */
  const filteredChildren = useMemo(
    () => (props.item.children ?? []).filter((child) => !child.meta?.isHide),
    [props.item.children],
  );

  /** hasChildren - 是否存在可见子菜单 / whether visible children exist */
  const hasChildren = useMemo(() => filteredChildren.length > 0, [filteredChildren]);

  /** menuTheme - 当前子菜单主题模式 / current submenu theme mode */
  const menuTheme = useMemo(() => resolveMenuTheme(props.theme), [props.theme]);

  /** activePath - 当前激活菜单路径 / current active menu path */
  const activePath = useMemo(() => location.pathname, [location.pathname]);

  /**
   * handleSelect - 子菜单选择回调
   * handleSelect - callback when submenu item is selected
   */
  const handleSelect = useCallback(
    (path: string, _parentPaths: string[]) => {
      /** findByPath - 递归在子树中查找菜单项 / recursively find menu item in subtree */
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

      const target = findByPath(props.item.children ?? []);
      if (!target) {
        return;
      }

      props.onClose?.();
      handleMenuJump(target);
    },
    [props.item.children, props.onClose],
  );

  if (!hasChildren) {
    return null;
  }

  return (
    <Menu
      theme={menuTheme}
      mode={props.isMobile ? 'vertical' : 'vertical'}
      defaultActive={activePath}
      onSelect={handleSelect}>
      {buildChildrenMenuNodes(filteredChildren)}
    </Menu>
  );
}
