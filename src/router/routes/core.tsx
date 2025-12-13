import type { AppRouteRecord } from '@/types';
import LazyLoad from '../LazyLoad';

const fallbackRoute: AppRouteRecord = {
  path: '*',
  meta: {
    title: 'fallback',
    isHide: true,
  },
  element: LazyLoad(() => import('@/pages/_core/fallback/not-found')),
};

const coreRoutes: AppRouteRecord[] = [
  {
    path: '/403',
    meta: {
      title: '403',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/forbidden')),
  },
  {
    path: '/404',
    meta: {
      title: '404',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/not-found')),
  },
  {
    path: '/500',
    meta: {
      title: '500',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/internal-error')),
  },
  {
    path: '/offline',
    meta: {
      title: 'Offline',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/offline')),
  },
  {
    path: '/coming-soon',
    meta: {
      title: 'Coming Soon',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/coming-soon')),
  },
];

export { coreRoutes, fallbackRoute };
