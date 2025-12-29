import { DefaultLayout } from '@/layouts';
import type { AppRouteRecord } from '@/types';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/dashboard',
    meta: { title: 'menus.dashboard.title' },
    element: <DefaultLayout />,
    children: [
      {
        path: 'console',
        index: true,
        element: LazyLoad(() => import('@/pages/dashboard/console/page')),
        meta: { title: 'menus.dashboard.console' },
      },
      {
        path: 'analysis',
        element: LazyLoad(() => import('@/pages/dashboard/analysis/page')),
        meta: { title: 'menus.dashboard.analysis' },
      },
      {
        path: 'ecommerce',
        element: LazyLoad(() => import('@/pages/dashboard/ecommerce/page')),
        meta: { title: 'menus.dashboard.ecommerce' },
      },
    ],
  },
] as AppRouteRecord[];
