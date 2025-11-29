import { Spin } from 'antd';
import { Suspense } from 'react';

export default function LazyLoad({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Spin />}>
      {children}
    </Suspense>
  );
}
