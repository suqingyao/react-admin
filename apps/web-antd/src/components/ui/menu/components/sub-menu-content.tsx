import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { useNamespace } from '@/hooks/ui/useNamespace';
import { useMenuContext } from '../hooks/useMenuContext';
import type { MenuItemProps } from '../types';

/**
 * SubMenuContentProps - 子菜单标题区域组件属性
 * SubMenuContentProps - props of submenu content component
 */
interface SubMenuContentProps extends MenuItemProps {
  /** children - 主内容插槽 / main content slot */
  children?: ReactNode;
  /** title - 显示的标题内容（优先于 children） / display title content, takes precedence over children */
  title?: ReactNode;
  /** isMenuMore - 是否为“更多”菜单 / whether submenu is used for "more" menu */
  isMenuMore?: boolean;
  /** isTopLevelMenuSubmenu - 是否为一级子菜单 / whether submenu is top level */
  isTopLevelMenuSubmenu: boolean;
  /** level - 当前子菜单层级 / current submenu level */
  level?: number;
}

/**
 * SubMenuContent - 子菜单标题区域组件（React 版本）
 * SubMenuContent - submenu content component (React version)
 */
export function SubMenuContent(props: SubMenuContentProps) {
  /** rootMenu - 根菜单上下文 / root menu context */
  const rootMenu = useMenuContext();
  /** nsSubMenuContent - 子菜单内容命名空间 / namespace helper for submenu content */
  const nsSubMenuContent = useNamespace('sub-menu-content');
  /** nsMenu - 菜单命名空间 / namespace helper for menu */
  const nsMenu = useNamespace('menu');

  /** opened - 子菜单是否展开 / whether submenu is opened */
  const opened = useMemo(
    () => rootMenu.openedMenus.includes(props.path),
    [props.path, rootMenu.openedMenus],
  );

  /** collapse - 菜单是否折叠 / whether menu is collapsed */
  const collapse = useMemo(() => !!rootMenu.props.collapse, [rootMenu.props.collapse]);

  /** isFirstLevel - 是否为第一层子菜单 / whether submenu is first level */
  const isFirstLevel = useMemo(() => props.level === 1, [props.level]);

  /** getCollapseShowTitle - 折叠时是否显示标题 / whether show title when collapsed */
  const getCollapseShowTitle = useMemo(
    () => !!rootMenu.props.collapseShowTitle && isFirstLevel && collapse,
    [collapse, isFirstLevel, rootMenu.props.collapseShowTitle],
  );

  /** mode - 菜单模式 / menu mode */
  const mode = useMemo(() => rootMenu.props.mode, [rootMenu.props.mode]);

  /** showArrowIcon - 是否展示箭头图标 / whether show arrow icon */
  const showArrowIcon = useMemo(
    () => mode === 'horizontal' || !(isFirstLevel && collapse),
    [collapse, isFirstLevel, mode],
  );

  /** hiddenTitle - 是否隐藏标题 / whether title is hidden */
  const hiddenTitle = useMemo(
    () => mode === 'vertical' && isFirstLevel && collapse && !getCollapseShowTitle,
    [collapse, getCollapseShowTitle, isFirstLevel, mode],
  );

  /** iconArrowStyle - 箭头图标样式 / arrow icon style */
  const iconArrowStyle = useMemo<CSSProperties>(
    () => (opened ? { transform: 'rotate(180deg)' } : {}),
    [opened],
  );

  return (
    <div
      className={[
        nsSubMenuContent.b(),
        nsSubMenuContent.is('collapse-show-title', getCollapseShowTitle),
        nsSubMenuContent.is('more', !!props.isMenuMore),
      ]
        .filter(Boolean)
        .join(' ')}>
      {props.title ?? props.children}

      {!props.isMenuMore && props.icon && (
        <NovaSvgIcon
          className={nsMenu.e('icon')}
          icon={typeof props.icon === 'string' ? props.icon : ''}
        />
      )}

      {!hiddenTitle && (
        <div className={nsSubMenuContent.e('title')}>{props.title ?? props.children}</div>
      )}

      {!props.isMenuMore && showArrowIcon && (
        <span className={nsSubMenuContent.e('icon-arrow')} style={iconArrowStyle}>
          ▼
        </span>
      )}
    </div>
  );
}

export type { SubMenuContentProps };
