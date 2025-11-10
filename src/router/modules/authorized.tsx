import type { RouteObject } from 'react-router';
import Login from '@/pages/authorized/login';

export default [
  {
    path: '/authorized/login',
    element: <Login />,
  },
] as RouteObject[];
