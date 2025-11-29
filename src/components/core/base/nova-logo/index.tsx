import { cn } from '@suqingyao/utils';

import { NovaSvgIcon } from '../nova-svg-icon';

export function NovaLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <NovaSvgIcon
      icon="ri:star-s-fill"
      className={cn('w-8 h-8', className)}
      style={style}
    />
  );
}
