import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';
import type { MenuRecordBadgeRaw } from '../types';
import { MenuBadgeDot } from './menu-badge-dot';

/**
 * MenuBadgeProps - 菜单徽标组件属性
 * MenuBadgeProps - props of menu badge component
 */
interface MenuBadgeProps extends MenuRecordBadgeRaw {
  /** hasChildren - 是否有子级菜单 / whether menu has children */
  hasChildren?: boolean;
  /** className - 自定义类名 / custom class name */
  className?: HTMLAttributes<HTMLSpanElement>['className'];
}

/**
 * variantsMap - 徽标预设颜色映射
 * variantsMap - preset badge color class mapping
 */
const variantsMap: Record<string, string> = {
  default: 'bg-green-500',
  destructive: 'bg-destructive',
  primary: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
};

/**
 * MenuBadge - 菜单徽标组件（React 版本）
 * MenuBadge - menu badge component (React version)
 */
export function MenuBadge(props: MenuBadgeProps) {
  /** isDot - 是否为圆点徽标 / whether badge is dot type */
  const isDot = useMemo(() => props.badgeType === 'dot', [props.badgeType]);

  /** badgeClass - 徽标样式类名 / badge style class name */
  const badgeClass = useMemo(() => {
    const { badgeVariants } = props;
    if (!badgeVariants) {
      return variantsMap.default;
    }
    return variantsMap[badgeVariants] || badgeVariants;
  }, [props]);

  /** badgeStyle - 徽标内联样式 / badge inline style */
  const badgeStyle = useMemo(() => {
    return {};
  }, []);

  if (!isDot && !props.badge) {
    return null;
  }

  return (
    <span className={`absolute ${props.className ?? ''}`}>
      {isDot ? (
        <MenuBadgeDot dotClass={badgeClass} dotStyle={badgeStyle} />
      ) : (
        <div
          className={`${badgeClass} text-primary-foreground flex-center rounded-xl px-1.5 py-0.5 text-[10px]`}
          style={badgeStyle}
        >
          {props.badge}
        </div>
      )}
    </span>
  );
}

export type { MenuBadgeProps };

