import { create } from 'zustand';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

interface UserState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
  /**
   * Actions
   */
  setUserInfo: (userInfo: BasicUserInfo | null) => void;
  setUserRoles: (roles: string[]) => void;
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  userRoles: [],
  setUserInfo: (userInfo) => {
    // 设置角色信息
    const roles = userInfo?.roles ?? [];
    set({ userInfo, userRoles: roles });
  },
  setUserRoles: (roles) => set({ userRoles: roles }),
}));
