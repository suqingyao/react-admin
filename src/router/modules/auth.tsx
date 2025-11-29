import type { AppRoute } from '../type';
import Login from '@/pages/auth/login';
import LazyLoad from '../LazyLoad';

export default [
  {
    path: '/auth/login',
    element: (
      <LazyLoad>
        <Login />
      </LazyLoad>
    ),
    meta: {
      title: '登录',
      standalone: true,
    },
  },
] as AppRoute[];
