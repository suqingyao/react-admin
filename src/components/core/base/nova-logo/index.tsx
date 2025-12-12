import { cn } from '@suqingyao/utils';

import { NovaSvgIcon } from '../nova-svg-icon';

interface NovaLogoProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function NovaLogo({ className, style, onClick }: NovaLogoProps) {
  return (
    <NovaSvgIcon
      icon="ri:star-s-fill"
      className={cn('w-8 h-8', className)}
      style={style}
      onClick={onClick}
    />
  );
}
