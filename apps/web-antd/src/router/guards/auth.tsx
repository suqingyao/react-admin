import { useEffect } from 'react';
import { useLocation, useMatches, useNavigate } from 'react-router';
import { usePermission } from '@/hooks/biz/usePermission';
import { setPageTitle } from '@/lib/router';
import { useUserStore } from '@/store';
import type { AppRouteRecord } from '@/types';
import { HOME_PAGE_PATH } from '../constants';

/**
 * 判断是否为独立的认证路由（无需登录即可访问）
 * Currently treats任何以 /auth 开头的路径为独立认证页。
 */
export const isStandaloneAuthRoute = (pathname: string): boolean => pathname.startsWith('/auth');

const getCurrentRouteMeta = (
  matches: ReturnType<typeof useMatches>,
): AppRouteRecord['meta'] | undefined => {
  const currentRoute = (matches as any[])[matches.length - 1];
  if (!currentRoute) return undefined;
  const routeMeta = (currentRoute.route as any)?.meta as AppRouteRecord['meta'] | undefined;
  return routeMeta;
};

export function AuthGuard({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();
  const { accessToken } = useUserStore();
  const { hasPermission } = usePermission();

  useEffect(() => {
    const pathname = location.pathname;
    const isAuthPage = isStandaloneAuthRoute(pathname);

    if (!accessToken) {
      if (!isAuthPage) {
        navigate('/auth/login', { replace: true });
      }
      return;
    }

    // 2. If logged in and visiting auth page, redirect to home
    if (isAuthPage) {
      navigate(HOME_PAGE_PATH, { replace: true });
      return;
    }

    const routeMeta = getCurrentRouteMeta(matches);
    if (routeMeta) {
      const requiredRoles = routeMeta.roles;

      if (requiredRoles && !hasPermission(requiredRoles)) {
        navigate('/403', { replace: true });
        return;
      }

      setPageTitle(routeMeta);
    }
  }, [accessToken, hasPermission, location.pathname, matches, navigate]);

  return children;
}
