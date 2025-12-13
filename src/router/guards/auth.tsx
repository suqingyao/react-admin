import { useEffect } from 'react';
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router';
import { usePermission } from '@/hooks/web/usePermission';
import { useUserStore } from '@/store';
import { HOME_PAGE_PATH } from '../constants';

export function AuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches();
  const { token } = useUserStore();
  const { hasPermission } = usePermission();

  useEffect(() => {
    const pathname = location.pathname;
    const isAuthPage = pathname.startsWith('/auth');

    // 1. Check token
    if (!token) {
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

    // 3. Check permissions
    const currentRoute = matches[matches.length - 1];
    if (currentRoute) {
      const routeMeta = (currentRoute.route as any).meta;
      const requiredRoles = routeMeta?.roles;

      if (requiredRoles && !hasPermission(requiredRoles)) {
        navigate('/403', { replace: true });
      }
    }
  }, [location.pathname, token, matches, hasPermission, navigate]);

  return <Outlet />;
}
