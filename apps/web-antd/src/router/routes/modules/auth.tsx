import type { AppRouteRecord } from '@/types';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/auth/login',
    element: LazyLoad(() => import('@/pages/auth/login')),
    meta: {
      title: 'menus.login.title',
      isHideTab: true,
    },
  },
  {
    path: '/auth/register',
    element: LazyLoad(() => import('@/pages/auth/register')),
    meta: {
      title: 'menus.register.title',
      isHideTab: true,
    },
  },
  {
    path: '/auth/forget-password',
    element: LazyLoad(() => import('@/pages/auth/forget-password')),
    meta: {
      title: 'menus.forgetPassword.title',
      isHideTab: true,
    },
  },
] as AppRouteRecord[];
