import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

type EasingName = 'linear' | 'easeOutExpo';

interface NovaCountToProps {
  target: number;
  duration?: number;
  autoStart?: boolean;
  decimals?: number;
  decimal?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
  easing?: EasingName;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const EPSILON = Number.EPSILON;
const MIN_DURATION = 100;
const MAX_DURATION = 60000;
const MAX_DECIMALS = 10;
const DEFAULT_EASING: EasingName = 'easeOutExpo';
const DEFAULT_DURATION = 2000;

const easingFunctions: Record<EasingName, (t: number) => number> = {
  linear: (t: number) => t,
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

const validateNumber = (value: number, defaultValue: number): number => {
  if (!Number.isFinite(value)) {
    return defaultValue;
  }
  return value;
};

const formatNumber = (
  value: number,
  decimals: number,
  decimal: string,
  separator: string,
): string => {
  const fixed =
    decimals > 0 ? value.toFixed(decimals) : Math.floor(value + EPSILON).toString();

  const decimalChar = decimal || '.';

  let result = fixed;

  if (decimalChar !== '.' && result.includes('.')) {
    result = result.replace('.', decimalChar);
  }

  if (separator) {
    const parts = result.split(decimalChar);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    result = parts.join(decimalChar);
  }

  return result;
};

export function NovaCountTo({
  target,
  duration = DEFAULT_DURATION,
  autoStart = true,
  decimals = 0,
  decimal = '.',
  separator = '',
  prefix = '',
  suffix = '',
  easing = DEFAULT_EASING,
  disabled = false,
  className,
  style,
}: NovaCountToProps) {
  const safeTarget = useMemo(
    () => validateNumber(target, 0),
    [target],
  );

  const safeDuration = useMemo(
    () =>
      clamp(
        validateNumber(duration, DEFAULT_DURATION),
        MIN_DURATION,
        MAX_DURATION,
      ),
    [duration],
  );

  const safeDecimals = useMemo(
    () =>
      clamp(
        validateNumber(decimals, 0),
        0,
        MAX_DECIMALS,
      ),
    [decimals],
  );

  const safeEasing = useMemo(() => {
    if (!easingFunctions[easing]) {
      return DEFAULT_EASING;
    }
    return easing;
  }, [easing]);

  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const valueRef = useRef(displayValue);
  useEffect(() => {
    valueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    if (disabled) {
      setDisplayValue(safeTarget);
      setIsRunning(false);
      return;
    }

    if (!autoStart) {
      setDisplayValue(safeTarget);
      setIsRunning(false);
      return;
    }

    let frameId: number | null = null;
    const startValue = valueRef.current;
    const diff = safeTarget - startValue;
    const startTime = performance.now();
    const easingFn = easingFunctions[safeEasing];

    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / safeDuration);
      const eased = easingFn(progress);
      const value = startValue + diff * eased;

      setDisplayValue(value);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
      }
    };

    setIsRunning(true);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [autoStart, disabled, safeDuration, safeEasing, safeTarget]);

  const formattedValue = useMemo(() => {
    const value = isRunning ? displayValue : safeTarget;

    if (!Number.isFinite(value)) {
      return `${prefix}0${suffix}`;
    }

    const formattedNumber = formatNumber(value, safeDecimals, decimal, separator);
    return `${prefix}${formattedNumber}${suffix}`;
  }, [decimal, displayValue, isRunning, prefix, safeDecimals, safeTarget, separator, suffix]);

  return (
    <span
      className={`tabular-nums text-g-900 ${
        isRunning ? 'transition-opacity duration-300 ease-in-out' : ''
      } ${className ?? ''}`}
      style={style}
    >
      {formattedValue}
    </span>
  );
}

