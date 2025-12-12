import { Icon } from '@iconify/react';
import { cn } from '@suqingyao/utils';

interface NovaSvgIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function NovaSvgIcon({ icon, className, style, onClick }: NovaSvgIconProps) {
  return <Icon icon={icon} className={cn('nova-svg-icon inline', className)} style={style} onClick={onClick} />;
}
