import { DefaultLayout } from '@/layouts';
import type { AppRouteRecord } from '@/types';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/system',
    meta: {
      title: '系统管理',
      icon: 'ri:settings-3-line',
    },
    element: <DefaultLayout />,
    children: [
      {
        path: 'roles',
        meta: {
          title: '角色管理',
          icon: 'ri:user-3-line',
        },
        element: LazyLoad(() => import('@/pages/system/roles/page')),
      },
      {
        path: 'permissions',
        meta: {
          title: '权限管理',
          icon: 'ri:key-2-line',
        },
        element: LazyLoad(() => import('@/pages/system/permissions/page')),
      },
      {
        path: 'menus',
        meta: {
          title: '菜单管理',
          icon: 'ri:menu-2-line',
        },
        element: LazyLoad(() => import('@/pages/system/menus/page')),
      },
      {
        path: 'departments',
        meta: {
          title: '部门管理',
          icon: 'ri:team-line',
        },
        element: LazyLoad(() => import('@/pages/system/departments/page')),
      },
    ],
  },
] as AppRouteRecord[];
