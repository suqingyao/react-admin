import { DefaultLayout } from '@/layouts';
import type { AppRouteRecord } from '@/types';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/system',
    meta: {
      title: 'menus.system.title',
    },
    element: <DefaultLayout />,
    children: [
      {
        path: 'user',
        meta: {
          title: 'menus.system.user',
        },
        element: LazyLoad(() => import('@/pages/system/user/page')),
      },
      {
        path: 'role',
        meta: {
          title: 'menus.system.role',
        },
        element: LazyLoad(() => import('@/pages/system/role/page')),
      },
      {
        path: 'menu',
        meta: {
          title: 'menus.system.menu',
        },
        element: LazyLoad(() => import('@/pages/system/menu/page')),
      },
    ],
  },
] as AppRouteRecord[];
