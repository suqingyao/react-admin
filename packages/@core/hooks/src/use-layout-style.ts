import {
  CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT,
  CSS_VARIABLE_LAYOUT_CONTENT_WIDTH,
  CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT,
  CSS_VARIABLE_LAYOUT_HEADER_HEIGHT,
} from '@nova-core/shared/constants';

import type { VisibleDomRect } from '@nova-core/shared/utils';
import { getElementVisibleRect } from '@nova-core/shared/utils';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Hook to manage a CSS variable.
 */
function useCssVar(varName: string, initialValue?: string) {
  const getValue = () => {
    if (typeof document === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(varName);
  };

  const setValue = (value: string) => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty(varName, value);
  };

  return {
    getValue,
    setValue,
  };
}

/**
 * @zh_CN content style
 */
export function useLayoutContentStyle() {
  const contentElementRef = useRef<HTMLDivElement>(null);
  const [visibleDomRect, setVisibleDomRect] = useState<VisibleDomRect | null>(null);

  const contentHeightVar = useCssVar(CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT);
  const contentWidthVar = useCssVar(CSS_VARIABLE_LAYOUT_CONTENT_WIDTH);

  const overlayStyle = useMemo((): CSSProperties => {
    const { height, left, top, width } = visibleDomRect ?? {};
    return {
      height: `${height}px`,
      left: `${left}px`,
      position: 'fixed',
      top: `${top}px`,
      width: `${width}px`,
      zIndex: 150,
    };
  }, [visibleDomRect]);

  const { run: calcHeight } = useDebounceFn(
    () => {
      if (contentElementRef.current) {
        const rect = getElementVisibleRect(contentElementRef.current);
        setVisibleDomRect(rect);
        contentHeightVar.setValue(`${rect.height}px`);
        contentWidthVar.setValue(`${rect.width}px`);
      }
    },
    { wait: 16 },
  );

  useEffect(() => {
    const element = contentElementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      calcHeight();
    });
    resizeObserver.observe(element);

    // Initial calculation
    calcHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, [calcHeight]);

  return { contentElementRef, overlayStyle, visibleDomRect };
}

export function useLayoutHeaderStyle() {
  const headerHeightVar = useCssVar(CSS_VARIABLE_LAYOUT_HEADER_HEIGHT);

  const getLayoutHeaderHeight = useMemoizedFn(() => {
    const val = headerHeightVar.getValue();
    return Number.parseInt(val, 10) || 0;
  });

  const setLayoutHeaderHeight = useMemoizedFn((height: number) => {
    headerHeightVar.setValue(`${height}px`);
  });

  return {
    getLayoutHeaderHeight,
    setLayoutHeaderHeight,
  };
}

export function useLayoutFooterStyle() {
  const footerHeightVar = useCssVar(CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT);

  const getLayoutFooterHeight = useMemoizedFn(() => {
    const val = footerHeightVar.getValue();
    return Number.parseInt(val, 10) || 0;
  });

  const setLayoutFooterHeight = useMemoizedFn((height: number) => {
    footerHeightVar.setValue(`${height}px`);
  });

  return {
    getLayoutFooterHeight,
    setLayoutFooterHeight,
  };
}
