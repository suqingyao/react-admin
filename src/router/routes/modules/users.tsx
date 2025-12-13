import { DefaultLayout } from '@/layouts';
import LazyLoad from '../../LazyLoad';

export default [
  {
    path: '/users',
    element: <DefaultLayout />,
    meta: {
      title: '用户管理',
      icon: 'ri:user-3-line',
    },
    children: [
      {
        path: 'list',
        index: true,
        element: LazyLoad(() => import('@/pages/users/page')),
        meta: { title: '用户列表', icon: 'ri:user-3-line' },
      },
    ],
  },
];
