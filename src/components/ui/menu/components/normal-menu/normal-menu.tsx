import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { useNamespace } from '@/hooks/ui/useNamespace';

/**
 * NormalMenuRecord - 普通菜单项数据结构
 * NormalMenuRecord - data structure of normal menu record
 */
interface NormalMenuRecord {
  /** path - 菜单路径 / menu path */
  path: string;
  /** name - 菜单名称 / menu name */
  name: string;
  /** icon - 菜单图标 / menu icon */
  icon?: string;
  /** activeIcon - 激活时图标 / icon when active */
  activeIcon?: string;
}

/**
 * NormalMenuProps - 普通菜单组件属性
 * NormalMenuProps - props of normal menu component
 */
interface NormalMenuProps {
  /** activePath - 当前激活菜单路径 / current active menu path */
  activePath?: string;
  /** collapse - 是否折叠 / whether menu is collapsed */
  collapse?: boolean;
  /** menus - 菜单项列表 / list of menu records */
  menus?: NormalMenuRecord[];
  /** rounded - 是否圆润风格 / whether rounded style is enabled */
  rounded?: boolean;
  /** theme - 菜单主题 / menu theme */
  theme?: 'dark' | 'light';
  /** onEnter - 鼠标进入时回调 / callback when mouse enter menu item */
  onEnter?: (menu: NormalMenuRecord) => void;
  /** onSelect - 选中菜单时回调 / callback when select menu item */
  onSelect?: (menu: NormalMenuRecord) => void;
  /** children - 插槽内容 / children content */
  children?: ReactNode;
}

/**
 * NormalMenu - 普通菜单组件（React 版本）
 * NormalMenu - normal menu component (React version)
 */
export function NormalMenu({
  activePath = '',
  collapse = false,
  menus = [],
  rounded = true,
  theme = 'dark',
  onEnter,
  onSelect,
}: NormalMenuProps) {
  /** nsNormalMenu - 普通菜单命名空间 / namespace helper for normal-menu */
  const nsNormalMenu = useNamespace('normal-menu');

  /** rootClassName - 根元素类名 / class name of root element */
  const rootClassName = useMemo(
    () =>
      [
        theme,
        nsNormalMenu.b(),
        nsNormalMenu.is('collapse', collapse),
        nsNormalMenu.is(theme, true),
        nsNormalMenu.is('rounded', rounded),
      ]
        .filter(Boolean)
        .join(' '),
    [collapse, nsNormalMenu, rounded, theme],
  );

  /**
   * resolveIcon - 解析菜单图标
   * resolveIcon - resolve icon for menu item
   */
  const resolveIcon = (menu: NormalMenuRecord) => {
    return activePath === menu.path
      ? menu.activeIcon || menu.icon
      : menu.icon;
  };

  return (
    <ul className={`${rootClassName} relative`}>
      {menus.map((menu) => {
        const isActive = activePath === menu.path;
        const itemClassName = [
          nsNormalMenu.e('item'),
          nsNormalMenu.is('active', isActive),
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li
            key={menu.path}
            className={itemClassName}
            onClick={() => onSelect?.(menu)}
            onMouseEnter={() => onEnter?.(menu)}
          >
            {resolveIcon(menu) && (
              <NovaSvgIcon
                className={nsNormalMenu.e('icon')}
                icon={resolveIcon(menu) ?? ''}
              />
            )}
            <span
              className={`${nsNormalMenu.e('name')} truncate`}
            >
              {menu.name}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export type { NormalMenuProps, NormalMenuRecord };

