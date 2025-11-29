import type { AppRoute } from '@/router/type';
import { Spin } from 'antd';
import { lazy, Suspense } from 'react';

const RolesPage = lazy(() => import('@/pages/system/roles/page'));
const PermissionsPage = lazy(() => import('@/pages/system/permissions/page'));
const MenusPage = lazy(() => import('@/pages/system/menus/page'));
const DepartmentsPage = lazy(() => import('@/pages/system/departments/page'));

export default [
  {
    path: '/system',
    meta: {
      title: '系统管理',
      icon: 'ri:settings-3-line',
      standalone: false,
    },
    children: [
      {
        path: 'roles',
        meta: {
          title: '角色管理',
          icon: 'ri:user-3-line',
        },
        element: <Suspense fallback={<Spin />}><RolesPage /></Suspense>,
      },
      {
        path: 'permissions',
        meta: {
          title: '权限管理',
          icon: 'ri:key-2-line',
        },
        element: <Suspense fallback={<Spin />}><PermissionsPage /></Suspense>,
      },
      {
        path: 'menus',
        meta: {
          title: '菜单管理',
          icon: 'ri:menu-2-line',
        },
        element: <Suspense fallback={<Spin />}><MenusPage /></Suspense>,
      },
      {
        path: 'departments',
        meta: {
          title: '部门管理',
          icon: 'ri:team-line',
        },
        element: <Suspense fallback={<Spin />}><DepartmentsPage /></Suspense>,
      },
    ],
  },
] as AppRoute[];
