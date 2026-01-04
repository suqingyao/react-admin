import { useEffect, useState } from 'react';

export type Breakpoints = Record<string, number | string>;

export const breakpointsTailwind: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export interface ConfigurableWindow {
  /*
   * Specify a custom `window` instance, e.g. working with iframes or in testing environments.
   */
  window?: Window;
}

export interface UseBreakpointsOptions extends ConfigurableWindow {
  /**
   * The query strategy to use for the generated shortcut methods like `.lg`
   *
   * 'min-width' - .lg will be true when the viewport is greater than or equal to the lg breakpoint (mobile-first)
   * 'max-width' - .lg will be true when the viewport is smaller than the xl breakpoint (desktop-first)
   *
   * @default "min-width"
   */
  strategy?: 'min-width' | 'max-width';
  ssrWidth?: number;
}

export function useBreakpoints(breakpoints: Breakpoints) {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getValue = (k: string) => {
    const val = breakpoints[k];
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.endsWith('px')) {
      return parseInt(val, 10);
    }
    return 0; // fallback
  };

  const greater = (k: string) => {
    const val = getValue(k);
    return windowWidth >= val;
  };

  const smaller = (k: string) => {
    const val = getValue(k);
    return windowWidth < val;
  };

  const between = (a: string, b: string) => {
    const valA = getValue(a);
    const valB = getValue(b);
    return windowWidth >= valA && windowWidth < valB;
  };

  const current = () => {
    const active: string[] = [];
    Object.entries(breakpoints).forEach(([k, v]) => {
      const val = typeof v === 'number' ? v : parseInt(v, 10);
      if (windowWidth >= val) {
        active.push(k);
      }
    });
    return active;
  };

  return {
    greater,
    smaller,
    between,
    isGreater: greater,
    isSmaller: smaller,
    isInBetween: between,
    current,
    // Add reactive properties if needed, but methods are enough for component rendering
    // since windowWidth state change triggers re-render.
  };
}
