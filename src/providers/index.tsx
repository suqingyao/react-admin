import { AntdProvider } from './antd-provider';
import { LangProvider } from './lang-provider';
import { RouterProvider } from './router-provider';
import { ThemeProvider } from './theme-provider';

export function Provider() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AntdProvider>
          <RouterProvider />
        </AntdProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
