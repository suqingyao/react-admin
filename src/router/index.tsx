import type { AppRoute } from './type';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { DefaultLayout } from '@/layouts';
import NotFound from '@/pages/exceptions/not-found';

const modules = import.meta.glob('./modules/**/*.tsx', { eager: true }) as Record<string, any>;

const routes: AppRoute[] = [];

Object.values(modules).forEach((mod) => {
  routes.push(...(mod.default as AppRoute[]));
});

const standaloneRoutes = routes.filter(r => r.meta?.standalone);
const nestedRoutes = routes
  .filter(r => !r.meta?.standalone)
  .map(r => ({
    ...r,
    path: r.path?.replace(/^\//, ''),
  }));

const router = createBrowserRouter([
  ...standaloneRoutes,
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      ...nestedRoutes,
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function RouterView() {
  return <RouterProvider router={router} />;
}

export function getMenuRoutes() {
  const modules = import.meta.glob('./modules/**/*.tsx', { eager: true }) as Record<string, any>;
  const menu: any[] = [];
  Object.values(modules).forEach((mod) => {
    const arr = (mod.default || []) as AppRoute[];
    arr.forEach((r) => {
      if (r.meta?.standalone)
        return;
      if (r.children && r.path) {
        menu.push({
          path: r.path,
          title: (r as any).meta?.title || r.path.replace(/^\//, '') || 'root',
          icon: (r as any).meta?.icon,
          routes: (r.children || []).map((c: any) => ({
            path: `${r.path?.replace(/\/$/, '')}/${c.path?.replace(/^\//, '')}`,
            title: c?.meta?.title || c.path?.replace(/^\//, ''),
            icon: c?.meta?.icon,
          })),
        });
      }
      else if (r.path) {
        menu.push({ path: r.path, title: (r as any).meta?.title || r.path.replace(/^\//, ''), icon: (r as any).meta?.icon });
      }
    });
  });
  return menu;
}
