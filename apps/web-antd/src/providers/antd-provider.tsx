import { ConfigProvider } from 'antd';
import type { PropsWithChildren } from 'react';

export function AntdProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      card={{
        styles: {
          body: {
            flex: 1,
            overflow: 'hidden',
            padding: '12px 16px',
          },
        },
      }}>
      {children}
    </ConfigProvider>
  );
}
