import { DefaultLayout } from '@/layouts';
import type { AppRouteRecord } from '@/types';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/dashboard',
    meta: { title: '仪表盘', icon: 'ri:dashboard-2-line' },
    element: <DefaultLayout />,
    children: [
      {
        path: 'console',
        index: true,
        element: LazyLoad(() => import('@/pages/dashboard/console/page')),
        meta: { title: '工作台', icon: 'ri:dashboard-2-line' },
      },
      {
        path: 'ecommerce',
        element: LazyLoad(() => import('@/pages/dashboard/ecommerce/page')),
        meta: { title: '电子商务', icon: 'ri:shopping-bag-2-line' },
      },
    ],
  },
] as AppRouteRecord[];
