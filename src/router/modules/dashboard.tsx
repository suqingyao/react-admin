import type { RouteObject } from 'react-router';
import DashboardPage from '@/pages/dashboard/page';

export default [
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
] as RouteObject[];
