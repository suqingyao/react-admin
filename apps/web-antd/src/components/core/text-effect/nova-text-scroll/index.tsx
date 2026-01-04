import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { useSettingStore } from '@/store/modules/setting';

type ThemeType =
  | 'theme'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

type ScrollDirection = 'left' | 'right' | 'up' | 'down';

interface NovaTextScrollProps {
  text?: string;
  type?: ThemeType;
  direction?: ScrollDirection;
  speed?: number;
  width?: string;
  height?: string;
  pauseOnHover?: boolean;
  showClose?: boolean;
  alwaysScroll?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onClose?: () => void;
}

export function NovaTextScroll({
  text = '',
  type = 'theme',
  direction = 'left',
  speed = 80,
  width = '100%',
  height = '36px',
  pauseOnHover = true,
  showClose = false,
  alwaysScroll = true,
  className,
  style,
  children,
  onClose,
}: NovaTextScrollProps) {
  const { isDark } = useSettingStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [textSize, setTextSize] = useState(0);
  const [containerSize, setContainerSize] = useState(0);
  const [shouldClone, setShouldClone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isHorizontal = useMemo(() => direction === 'left' || direction === 'right', [direction]);

  const isReverse = useMemo(() => direction === 'right' || direction === 'down', [direction]);

  const isPaused = useMemo(() => {
    if (!alwaysScroll && textSize <= containerSize) {
      return true;
    }
    return pauseOnHover && isHovered;
  }, [alwaysScroll, pauseOnHover, textSize, containerSize, isHovered]);

  const themeClasses = useMemo(() => {
    const themeMap: Record<ThemeType, string> = {
      theme: 'text-theme/90 !border-theme/50',
      primary: 'text-primary/90 !border-primary/50',
      secondary: 'text-secondary/90 !border-secondary/50',
      error: 'text-error/90 !border-error/50',
      info: 'text-info/90 !border-info/50',
      success: 'text-success/90 !border-success/50',
      warning: 'text-warning/90 !border-warning/50',
      danger: 'text-danger/90 !border-danger/50',
    };
    return themeMap[type] || themeMap.theme;
  }, [type]);

  const bgColor = useMemo(() => {
    const dark = isDark();
    const percent = dark ? '25' : '10';
    return `color-mix(in oklch, var(--color-${type}) ${percent}%, var(--art-color))`;
  }, [isDark, type]);

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width,
      height,
      backgroundColor: bgColor,
      ...style,
    }),
    [bgColor, height, style, width],
  );

  const contentClass = useMemo(() => {
    if (!isHorizontal) {
      return 'flex flex-col';
    }
    return '';
  }, [isHorizontal]);

  const contentStyle = useMemo<CSSProperties>(
    () => ({
      transform: isHorizontal
        ? `translateX(${currentPosition}px)`
        : `translateY(${currentPosition}px)`,
      willChange: 'transform',
    }),
    [currentPosition, isHorizontal],
  );

  const cloneSpacing = useMemo<CSSProperties>(() => {
    const spacing = '2em';
    if (isHorizontal) {
      return { marginLeft: spacing };
    }
    return { marginTop: spacing };
  }, [isHorizontal]);

  const measureSizes = () => {
    const container = containerRef.current;
    const textElement = textRef.current;
    if (!container || !textElement) return;

    const rect = container.getBoundingClientRect();
    const size = isHorizontal ? rect.width : rect.height;
    const textLength = isHorizontal ? textElement.offsetWidth : textElement.offsetHeight;

    setContainerSize(size);
    setTextSize(textLength);
    setShouldClone(textLength > size);

    const initialPosition = (size - textLength) / 2;
    setCurrentPosition(initialPosition);

    if (!isReady) {
      setIsReady(true);
    }
  };

  useEffect(() => {
    measureSizes();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureSizes();
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [direction, text, width, height, isHorizontal]);

  const lastTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    lastTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = timestamp;
      }

      const last = lastTimeRef.current;
      const delta = (timestamp - last) / 1000;
      lastTimeRef.current = timestamp;

      if (!isPaused && textSize > 0) {
        const distance = speed * delta;
        const spacing = textSize * 0.1;

        setCurrentPosition((prev) => {
          let next = prev + (isReverse ? distance : -distance);

          if (isReverse) {
            if (next > containerSize) {
              next = -(textSize + spacing);
            }
          } else if (next < -(textSize + spacing)) {
            next = containerSize;
          }

          return next;
        });
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      lastTimeRef.current = null;
    };
  }, [containerSize, isPaused, isReverse, speed, textSize]);

  const handleContentClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      event.stopPropagation();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex-c box-border overflow-hidden rounded-custom-sm border text-sm ${themeClasses} ${className ?? ''}`}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex-cc absolute left-0 z-10 h-full w-9" style={{ backgroundColor: bgColor }}>
        <NovaSvgIcon icon="ri:volume-down-line" className="text-lg" />
      </div>

      <div
        className={`inline-block whitespace-nowrap px-9 transition-opacity duration-600 [&_a]:text-danger [&_a:hover]:underline [&_a:hover]:text-danger/80 ${
          isReady ? 'opacity-100' : 'opacity-0'
        } ${contentClass}`}
        style={contentStyle}
        onClick={handleContentClick}>
        <span ref={textRef} className="inline-block">
          {children ?? text}
        </span>
        {shouldClone && (
          <span className="inline-block" style={cloneSpacing}>
            {children ?? text}
          </span>
        )}
      </div>

      {showClose && (
        <div
          className="flex-cc absolute right-0 h-full w-9 cursor-pointer"
          style={{ backgroundColor: bgColor }}
          onClick={handleClose}>
          <NovaSvgIcon icon="ri:close-fill" className="text-lg" />
        </div>
      )}
    </div>
  );
}
