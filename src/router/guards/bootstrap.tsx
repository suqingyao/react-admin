import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { fetchGetUserInfo } from '@/api/auth';
import { fetchGetMenuList } from '@/api/system-manage';
import { useCommon } from '@/hooks/core/useCommon';
import { isHttpError } from '@/lib/http/error';
import { loadingService } from '@/lib/ui';
import { useMenuStore, useUserStore } from '@/store';
import { HOME_PAGE_PATH } from '../constants';
import { isStandaloneAuthRoute } from './auth';

export function BootstrapGuard({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, setUserInfo, checkAndClearWorktabs } = useUserStore();
  const { menuList, setMenuList } = useMenuStore();
  const { homePath } = useCommon();

  useEffect(() => {
    const pathname = location.pathname;

    if (!accessToken) {
      return;
    }

    if (pathname.startsWith('/auth')) {
      return;
    }

    if (menuList.length) {
      return;
    }

    const close = loadingService.showLoading();
    Promise.all([fetchGetUserInfo(), fetchGetMenuList()])
      .then(([userData, menus]) => {
        setUserInfo(userData);
        checkAndClearWorktabs();
        setMenuList(menus);

        if (pathname === '/') {
          const target = homePath || HOME_PAGE_PATH;
          if (target && target !== pathname) {
            navigate(target, { replace: true });
          }
        }
      })
      .catch((error) => {
        if (!isHttpError(error)) {
          console.error(error);
        }
      })
      .finally(() => {
        close();
      });
  }, [
    accessToken,
    checkAndClearWorktabs,
    homePath,
    location.pathname,
    menuList.length,
    navigate,
    setMenuList,
    setUserInfo,
  ]);

  return children;
}
