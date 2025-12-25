/**
 * 用户状态管理模块
 *
 * 提供用户相关的状态管理
 *
 * ## 主要功能
 *
 * - 用户登录状态管理
 * - 用户信息存储
 * - 访问令牌和刷新令牌管理
 * - 语言设置
 * - 搜索历史记录
 * - 锁屏状态和密码管理
 * - 登出清理逻辑
 *
 * ## 使用场景
 *
 * - 用户登录和认证
 * - 权限验证
 * - 个人信息展示
 * - 多语言切换
 * - 锁屏功能
 * - 搜索历史管理
 *
 * ## 持久化
 *
 * - 使用 localStorage 存储
 * - 存储键：user-storage
 * - 登出时自动清理
 *
 * @module store/modules/user
 * @author Art Design Pro Team
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { LanguageEnum } from '@/enums/appEnum';
import { setPageTitle } from '@/lib/router';
import { localStorageManager } from '@/lib/storage';
import { HOME_PAGE_PATH } from '@/router/constants';
import type { AppRouteRecord } from '@/types/router';
import { useMenuStore } from './menu';
import { useWorktabStore } from './worktab';

interface UserState {
  language: LanguageEnum;
  isLogin: boolean;
  isLock: boolean;
  lockPassword: string;
  info: Partial<Api.Auth.UserInfo>;
  searchHistory: AppRouteRecord[];
  accessToken: string;
  refreshToken: string;
}

interface UserActions {
  /** 设置用户信息 */
  setUserInfo: (newInfo: Api.Auth.UserInfo) => void;
  /** 设置登录状态 */
  setLoginStatus: (status: boolean) => void;
  /** 设置语言 */
  setLanguage: (lang: LanguageEnum, currentRouteMeta?: AppRouteRecord['meta']) => void;
  /** 设置搜索历史 */
  setSearchHistory: (list: AppRouteRecord[]) => void;
  /** 设置锁屏状态 */
  setLockStatus: (status: boolean) => void;
  /** 设置锁屏密码 */
  setLockPassword: (password: string) => void;
  /** 设置令牌 */
  setToken: (newAccessToken: string, newRefreshToken?: string) => void;
  /** 退出登录 */
  logOut: (navigate: (path: string, options?: any) => void, currentPath?: string) => void;
  /** 检查并清理工作台标签页 */
  checkAndClearWorktabs: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // 状态初始化
      language: LanguageEnum.ZH,
      isLogin: false,
      isLock: false,
      lockPassword: '',
      info: {},
      searchHistory: [],
      accessToken: '',
      refreshToken: '',

      // Actions
      setUserInfo: (newInfo: Api.Auth.UserInfo) => {
        set({ info: newInfo });
      },

      setLoginStatus: (status: boolean) => {
        set({ isLogin: status });
      },

      setLanguage: (lang: LanguageEnum, currentRouteMeta?: AppRouteRecord['meta']) => {
        set({ language: lang });
        if (currentRouteMeta) {
          setPageTitle(currentRouteMeta);
        }
      },

      setSearchHistory: (list: AppRouteRecord[]) => {
        set({ searchHistory: list });
      },

      setLockStatus: (status: boolean) => {
        set({ isLock: status });
      },

      setLockPassword: (password: string) => {
        set({ lockPassword: password });
      },

      setToken: (newAccessToken: string, newRefreshToken?: string) => {
        const newState: Partial<UserState> = { accessToken: newAccessToken };
        if (newRefreshToken) {
          newState.refreshToken = newRefreshToken;
        }
        set(newState);
      },

      logOut: (navigate: (path: string, options?: any) => void, currentPath?: string) => {
        const { info } = get();
        // 保存当前用户 ID，用于下次登录时判断是否为同一用户
        const currentUserId = info.userId;
        if (currentUserId) {
          localStorageManager.setItem('last-user-id-key', String(currentUserId));
        }

        // 清空所有状态
        set({
          info: {},
          isLogin: false,
          isLock: false,
          lockPassword: '',
          accessToken: '',
          refreshToken: '',
        });

        // 注意：不清空工作台标签页，等下次登录时根据用户判断
        // 移除iframe路由缓存
        sessionStorage.removeItem('iframeRoutes');

        // 清空主页路径
        useMenuStore.getState().setHomePath(HOME_PAGE_PATH);

        // 跳转到登录页，携带当前路由作为 redirect 参数
        const redirect = currentPath && currentPath !== '/auth/login' ? currentPath : undefined;

        navigate('/auth/login', {
          replace: true,
          state: redirect ? { from: redirect } : undefined,
        });
      },

      checkAndClearWorktabs: () => {
        const { info } = get();
        const lastUserId = localStorageManager.getItem('last-user-id-key');
        const currentUserId = info.userId;

        // 无法获取当前用户 ID，跳过检查
        if (!currentUserId) return;

        // 首次登录或缓存已清除，保留现有标签页
        if (!lastUserId) {
          return;
        }

        // 不同用户登录，清空工作台标签页
        if (String(currentUserId) !== lastUserId) {
          // 直接调用 worktab store 的方法清空
          useWorktabStore.getState().clearAll();
        }

        // 清除临时存储
        localStorageManager.removeItem('last-user-id-key');
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
