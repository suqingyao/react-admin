import { Spin } from 'antd';
import type { ComponentType } from 'react';
import { lazy, Suspense } from 'react';

/**
 * 路由懒加载工具函数
 * @param importFunc 动态导入函数，例如: () => import('@/pages/dashboard')
 * @returns 包装了 Suspense 的组件
 */
export function LazyLoad(importFunc: () => Promise<{ default: ComponentType<any> }>) {
  const LazyComponent = lazy(importFunc);

  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spin />
        </div>
      }
    >
      <LazyComponent />
    </Suspense>
  );
}

export default LazyLoad;
