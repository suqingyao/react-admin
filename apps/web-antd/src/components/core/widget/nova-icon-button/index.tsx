import { cn } from '@suqingyao/utils';

import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';

interface NovaIconButtonProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function NovaIconButton({ icon, className, style, children, onClick }: NovaIconButtonProps) {
  return (
    <div
      className={cn(
        'size-8.5 inline-flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-800 text-xl rounded tad-300 hover:bg-hover-color',
        className,
      )}
      style={style}
      onClick={onClick}>
      <NovaSvgIcon icon={icon} />
      {children}
    </div>
  );
}
