/**
 * useLayoutHeight - 页面布局高度管理
 *
 * 自动计算和管理页面内容区域的高度，确保内容区域能够正确填充剩余空间。
 * 监听头部元素高度变化，动态调整内容区域高度，避免出现滚动条或布局错乱。
 *
 * ## 主要功能
 *
 * 1. 动态高度计算 - 根据头部元素高度自动计算内容区域高度
 * 2. 响应式监听 - 自动监听元素尺寸变化并更新高度
 * 3. CSS 变量同步 - 自动更新 CSS 变量，方便全局使用
 * 4. 灵活配置 - 支持自定义间距、CSS 变量名等
 * 5. 自动查找模式 - 提供通过 ID 自动查找元素的便捷方式
 *
 * @module useLayoutHeight
 * @author Art Design Pro Team
 */

import { useEffect, useMemo, useState } from 'react';

/**
 * 页面容器高度配置
 */
interface LayoutHeightOptions {
  extraSpacing?: number;
  updateCssVar?: boolean;
  cssVarName?: string;
}

interface LayoutHeightResult {
  containerMinHeight: string;
  headerRef: (element: HTMLElement | null) => void;
  contentHeaderRef: (element: HTMLElement | null) => void;
  headerHeight: number;
  contentHeaderHeight: number;
}

interface ElementSize {
  width: number;
  height: number;
}

function useElementSize(element: HTMLElement | null): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!element) {
      setSize({ width: 0, height: 0 });
      return;
    }

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('resize', update);
      };
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          const rect = entry.contentRect;
          setSize({ width: rect.width, height: rect.height });
        }
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element]);

  return size;
}

export function useLayoutHeight(options: LayoutHeightOptions = {}): LayoutHeightResult {
  const { extraSpacing = 15, updateCssVar = true, cssVarName = '--art-full-height' } = options;

  const [headerElement, setHeaderElement] = useState<HTMLElement | null>(null);
  const [contentHeaderElement, setContentHeaderElement] = useState<HTMLElement | null>(null);

  const headerSize = useElementSize(headerElement);
  const contentHeaderSize = useElementSize(contentHeaderElement);

  const containerMinHeight = useMemo(() => {
    const totalHeight = headerSize.height + contentHeaderSize.height + extraSpacing;
    return `calc(100vh - ${totalHeight}px)`;
  }, [headerSize.height, contentHeaderSize.height, extraSpacing]);

  useEffect(() => {
    if (!updateCssVar) return;
    const id = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty(cssVarName, containerMinHeight);
    });
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [containerMinHeight, cssVarName, updateCssVar]);

  return {
    containerMinHeight,
    headerRef: setHeaderElement,
    contentHeaderRef: setContentHeaderElement,
    headerHeight: headerSize.height,
    contentHeaderHeight: contentHeaderSize.height,
  };
}

/**
 * 通过 ID 自动查找元素的布局高度管理
 * 适用于无法直接获取元素引用的场景
 *
 * @param headerIds 头部元素的 ID 数组
 * @param options 配置选项
 *
 * ```
 */
export function useAutoLayoutHeight(
  headerIds: string[] = ['app-header', 'app-content-header'],
  options: LayoutHeightOptions = {},
): LayoutHeightResult {
  const { extraSpacing = 15, updateCssVar = true, cssVarName = '--art-full-height' } = options;

  const [headerElement, setHeaderElement] = useState<HTMLElement | null>(null);
  const [contentHeaderElement, setContentHeaderElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const frameId = window.requestAnimationFrame(() => {
      const [headerId, contentHeaderId] = headerIds;
      const header = headerId ? (document.getElementById(headerId) as HTMLElement | null) : null;
      const contentHeader = contentHeaderId
        ? (document.getElementById(contentHeaderId) as HTMLElement | null)
        : null;
      setHeaderElement(header);
      setContentHeaderElement(contentHeader);
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [headerIds]);

  const headerSize = useElementSize(headerElement);
  const contentHeaderSize = useElementSize(contentHeaderElement);

  const containerMinHeight = useMemo(() => {
    const totalHeight = headerSize.height + contentHeaderSize.height + extraSpacing;
    return `calc(100vh - ${totalHeight}px)`;
  }, [headerSize.height, contentHeaderSize.height, extraSpacing]);

  useEffect(() => {
    if (!updateCssVar) return;
    const id = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty(cssVarName, containerMinHeight);
    });
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [containerMinHeight, cssVarName, updateCssVar]);

  return {
    containerMinHeight,
    headerRef: setHeaderElement,
    contentHeaderRef: setContentHeaderElement,
    headerHeight: headerSize.height,
    contentHeaderHeight: contentHeaderSize.height,
  };
}
