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
      title: 'menus.exception.forbidden',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/forbidden')),
  },
  {
    path: '/404',
    meta: {
      title: 'menus.exception.notFound',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/not-found')),
  },
  {
    path: '/500',
    meta: {
      title: 'menus.exception.serverError',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/internal-error')),
  },
  {
    path: '/offline',
    meta: {
      title: 'core.offline',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/offline')),
  },
  {
    path: '/coming-soon',
    meta: {
      title: 'core.comingSoon',
      isHide: true,
    },
    element: LazyLoad(() => import('@/pages/_core/fallback/coming-soon')),
  },
];

export { coreRoutes, fallbackRoute };
