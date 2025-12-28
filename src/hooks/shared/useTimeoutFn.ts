import { isClient } from '@suqingyao/utils';
import { useCallback, useEffect, useRef } from 'react';
import type { NOOP } from '@/types';

interface UseTimeoutFnOptions {
  /**
   * Start the timer immediately
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Execute the callback immediately after calling `start`
   *
   * @default false
   */
  immediateCallback?: boolean;
}

export function useTimeoutFn<CallbackFn extends NOOP>(
  fn: CallbackFn,
  interval: number,
  options: UseTimeoutFnOptions = { immediate: true, immediateCallback: false },
) {
  const { immediate = true, immediateCallback = false } = options;

  const cbRef = useRef(fn);
  useEffect(() => {
    cbRef.current = fn;
  }, [fn]);

  const isPendingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isPendingRef.current = false;
  }, []);

  const stop = useCallback(() => {
    isPendingRef.current = false;
    clear();
  }, [clear]);

  const start = useCallback(
    (...args: Parameters<CallbackFn> | []) => {
      if (immediateCallback) cbRef.current(...args);
      clear();
      isPendingRef.current = true;
      if (isClient()) {
        timerRef.current = setTimeout(() => {
          isPendingRef.current = false;
          timerRef.current = null;
          cbRef.current(...args);
        }, interval);
      }
    },
    [interval, immediateCallback, clear],
  );

  useEffect(() => {
    if (immediate && isClient()) start();
    return () => stop();
  }, [immediate, start, stop]);

  return { clear, stop, start };
}
