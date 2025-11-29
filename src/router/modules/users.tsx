import UsersPage from '@/pages/users/page';

export default [
  {
    path: '/users',
    element: <UsersPage />,
    meta: {
      title: '用户管理',
      icon: 'ri:user-3-line',
    },
  },
];
