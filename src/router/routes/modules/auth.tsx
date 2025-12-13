import type { AppRouteRecord } from '@/types';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/auth/login',
    element: LazyLoad(() => import('@/pages/auth/login')),
    meta: {
      title: '登录',
      standalone: true,
    },
  },
  {
    path: '/auth/register',
    element: LazyLoad(() => import('@/pages/auth/register')),
    meta: {
      title: '注册',
      standalone: true,
    },
  },
  {
    path: '/auth/forget-password',
    element: LazyLoad(() => import('@/pages/auth/forget-password')),
    meta: {
      title: '忘记密码',
      standalone: true,
    },
  },
] as AppRouteRecord[];
