import type { AppRouteRecord } from '@/types';
import { AppGuard } from '../guards';
import { coreRoutes, fallbackRoute } from './core';

const dynamicModules = import.meta.glob('./modules/**/*.tsx', { eager: true }) as Record<
  string,
  any
>;

const dynamicRoutes: AppRouteRecord[] = Object.values(dynamicModules).reduce(
  (acc: AppRouteRecord[], cur: any) => {
    acc.push(...(cur.default || []));
    return acc;
  },
  [],
);

const routes: AppRouteRecord[] = [
  ...coreRoutes,
  {
    path: '/',
    meta: {
      title: '首页',
      icon: 'ri:home-2-line',
    },
    element: <AppGuard />,
    children: [...dynamicRoutes],
  },
  fallbackRoute,
];

const resetRoutes = routes.filter((item) => item.path !== '/');

export { resetRoutes, routes };
