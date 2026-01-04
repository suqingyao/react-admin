import type { CSSProperties } from 'react';

/**
 * MenuBadgeDotProps - 菜单徽标圆点组件属性
 * MenuBadgeDotProps - props of menu badge dot component
 */
interface MenuBadgeDotProps {
  /** dotClass - 圆点样式类名 / dot style class name */
  dotClass?: string;
  /** dotStyle - 圆点内联样式 / dot inline style */
  dotStyle?: CSSProperties;
}

/**
 * MenuBadgeDot - 菜单徽标圆点组件（React 版本）
 * MenuBadgeDot - menu badge dot component (React version)
 */
export function MenuBadgeDot({
  dotClass = '',
  dotStyle = {},
}: MenuBadgeDotProps) {
  return (
    <span className="relative mr-1 flex size-1.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotClass}`}
        style={dotStyle}
      />
      <span
        className={`relative inline-flex size-1.5 rounded-full ${dotClass}`}
        style={dotStyle}
      />
    </span>
  );
}

export type { MenuBadgeDotProps };

