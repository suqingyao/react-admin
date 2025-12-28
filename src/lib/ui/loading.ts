import { Spin } from 'antd';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { fourDotsSpinnerSvg } from '@/assets/svg/loading';

/**
 * 获取当前主题对应的loading背景色
 * @returns 背景色字符串
 */
const getLoadingBackground = (): string => {
  const isDark = document.documentElement.classList.contains('dark');
  return isDark ? 'rgba(7, 7, 7, 0.85)' : '#fff';
};

const DEFAULT_LOADING_CONFIG = {
  lock: true,
  get background() {
    return getLoadingBackground();
  },
  svg: fourDotsSpinnerSvg,
  svgViewBox: '0 0 40 40',
  customClass: 'art-loading-fix',
} as const;

interface LoadingInstance {
  close: () => void;
}

let loadingInstance: LoadingInstance | null = null;

export const loadingService = {
  /**
   * 显示 loading
   * @returns 关闭 loading 的函数
   */
  showLoading(): () => void {
    if (!loadingInstance) {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return () => {};
      }
      const config = {
        ...DEFAULT_LOADING_CONFIG,
        background: getLoadingBackground(),
      };
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.inset = '0';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.background = config.background;
      container.style.pointerEvents = 'auto';
      document.body.appendChild(container);

      const root = createRoot(container);

      root.render(
        createElement(Spin, {
          size: 'large',
        }),
      );

      loadingInstance = {
        close: () => {
          root.unmount();
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        },
      };
    }
    return () => this.hideLoading();
  },

  /**
   * 隐藏 loading
   */
  hideLoading(): void {
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  },
};
