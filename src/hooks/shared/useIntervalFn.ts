import { isClient } from '@suqingyao/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { NOOP } from '@/types';

export interface UseIntervalFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Execute the callback immediately after calling `resume`
   *
   * @default false
   */
  immediateCallback?: boolean;
}

export interface UseIntervalFnReturn {
  /** 当前是否处于运行状态 | Whether interval is active */
  isActive: boolean;
  /** 暂停计时器 | Pause timer */
  pause: () => void;
  /** 恢复/启动计时器 | Resume/Start timer */
  resume: () => void;
}

/**
 * React 版本的 setInterval 封装，提供启停控制
 * React version of setInterval wrapper with controls
 */
export function useIntervalFn<CallbackFn extends NOOP>(
  fn: CallbackFn,
  interval: number = 1000,
  options: UseIntervalFnOptions = { immediate: true, immediateCallback: false },
): UseIntervalFnReturn {
  const { immediate = true, immediateCallback = false } = options;

  const cbRef = useRef(fn);
  useEffect(() => {
    cbRef.current = fn;
  }, [fn]);

  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
    clear();
  }, [clear]);

  const resume = useCallback(() => {
    const ms = interval;
    if (ms <= 0) return;
    setIsActive(true);
    if (immediateCallback) cbRef.current();
    clear();
    if (isClient()) {
      timerRef.current = setInterval(() => cbRef.current(), ms);
    }
  }, [interval, immediateCallback, clear]);

  // 初始化：可选立即启动
  useEffect(() => {
    if (immediate && isClient()) resume();
    return () => pause();
  }, [immediate, pause, resume]);

  // 当 interval 发生变化且当前处于激活状态时，重启计时器
  useEffect(() => {
    if (!isActive) return;
    clear();
    if (isClient()) timerRef.current = setInterval(() => cbRef.current(), interval);
    return () => {
      clear();
    };
  }, [interval, isActive, clear]);

  return { isActive, pause, resume };
}
