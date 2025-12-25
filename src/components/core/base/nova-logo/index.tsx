import { cn } from '@suqingyao/utils';

interface NovaLogoProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function NovaLogo({ className, style, onClick }: NovaLogoProps) {
  return (
    <div className="flex items-center justify-center">
      <img
        src="/favicon.svg"
        alt="Nova Logo"
        className={cn('size-8 cursor-pointer', className)}
        style={style}
        onClick={onClick}
      />
    </div>
  );
}
