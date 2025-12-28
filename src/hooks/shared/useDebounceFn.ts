import { useDebounce } from 'ahooks';

export const useDebounceFn = <T extends (...args: any[]) => any>(fn: T, delay = 320) => {
  const debounced = useDebounce(fn, delay);
  return {
    run: debounced,
  };
};
