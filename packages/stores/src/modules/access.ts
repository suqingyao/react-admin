import type { MenuRecordRaw } from '@nova-core/typings';

// Replaced vue-router with any for now, as react-router types might need specific integration
// import type { RouteRecordRaw } from 'vue-router';
// Using any for routes to avoid breaking changes until full router migration
type RouteRecordRaw = any;

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createSecureStorage } from '../setup';

type AccessToken = null | string;

interface AccessState {
  accessCodes: string[];
  accessMenus: MenuRecordRaw[];
  accessRoutes: RouteRecordRaw[];
  accessToken: AccessToken;
  isAccessChecked: boolean;
  isLockScreen: boolean;
  lockScreenPassword?: string;
  loginExpired: boolean;
  refreshToken: AccessToken;

  // Actions
  getMenuByPath: (path: string) => MenuRecordRaw | undefined;
  lockScreen: (password: string) => void;
  setAccessCodes: (codes: string[]) => void;
  setAccessMenus: (menus: MenuRecordRaw[]) => void;
  setAccessRoutes: (routes: RouteRecordRaw[]) => void;
  setAccessToken: (token: AccessToken) => void;
  setIsAccessChecked: (isAccessChecked: boolean) => void;
  setLoginExpired: (loginExpired: boolean) => void;
  setRefreshToken: (token: AccessToken) => void;
  unlockScreen: () => void;
}

/**
 * @zh_CN 访问权限相关
 */
export const useAccessStore = create<AccessState>()(
  persist(
    (set, get) => ({
      accessCodes: [],
      accessMenus: [],
      accessRoutes: [],
      accessToken: null,
      isAccessChecked: false,
      isLockScreen: false,
      lockScreenPassword: undefined,
      loginExpired: false,
      refreshToken: null,

      getMenuByPath: (path: string) => {
        const { accessMenus } = get();
        function findMenu(menus: MenuRecordRaw[], path: string): MenuRecordRaw | undefined {
          for (const menu of menus) {
            if (menu.path === path) {
              return menu;
            }
            if (menu.children) {
              const matched = findMenu(menu.children, path);
              if (matched) {
                return matched;
              }
            }
          }
        }
        return findMenu(accessMenus, path);
      },
      lockScreen: (password: string) => {
        set({ isLockScreen: true, lockScreenPassword: password });
      },
      setAccessCodes: (codes: string[]) => {
        set({ accessCodes: codes });
      },
      setAccessMenus: (menus: MenuRecordRaw[]) => {
        set({ accessMenus: menus });
      },
      setAccessRoutes: (routes: RouteRecordRaw[]) => {
        set({ accessRoutes: routes });
      },
      setAccessToken: (token: AccessToken) => {
        set({ accessToken: token });
      },
      setIsAccessChecked: (isAccessChecked: boolean) => {
        set({ isAccessChecked });
      },
      setLoginExpired: (loginExpired: boolean) => {
        set({ loginExpired });
      },
      setRefreshToken: (token: AccessToken) => {
        set({ refreshToken: token });
      },
      unlockScreen: () => {
        set({ isLockScreen: false, lockScreenPassword: undefined });
      },
    }),
    {
      name: 'core-access',
      storage: createJSONStorage(() => createSecureStorage('nova')),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        accessCodes: state.accessCodes,
        isLockScreen: state.isLockScreen,
        lockScreenPassword: state.lockScreenPassword,
      }),
    },
  ),
);
