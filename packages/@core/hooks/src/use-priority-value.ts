import { getFirstNonNullOrUndefined } from '@nova-core/shared/utils';
import { useMemo } from 'react';

/**
 * React implementation of priority value resolution.
 * In React, we typically don't access props/slots/attrs dynamically in the same way as Vue.
 * This hook simplifies the logic to resolving from a list of sources.
 *
 * Usage:
 * const value = usePriorityValue('key', props, state);
 *
 * Sources checked in order:
 * 1. props[key]
 * 2. state[key]
 */
export function usePriorityValue<
  T extends Record<string, any>,
  S extends Record<string, any>,
  K extends keyof T = keyof T,
>(key: K, props: T, state?: S) {
  const value = useMemo(() => {
    return getFirstNonNullOrUndefined(props[key as string], state?.[key as keyof S]) as T[K];
  }, [key, props, state]);

  return value;
}

/**
 * Batch resolve values
 */
export function usePriorityValues<T extends Record<string, any>, S extends Record<string, any>>(
  props: T,
  state?: S,
) {
  const result = useMemo(() => {
    const res = {} as { [K in keyof T]: T[K] };
    (Object.keys(props) as (keyof T)[]).forEach((key) => {
      // @ts-expect-error
      res[key] = getFirstNonNullOrUndefined(props[key], state?.[key]);
    });
    return res;
  }, [props, state]);

  return result;
}

// Deprecated/Aliased for compatibility
export const useForwardPriorityValues = usePriorityValues;
