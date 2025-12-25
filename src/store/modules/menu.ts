import { create } from 'zustand';
import { getFirstMenuPath } from '@/lib/navigation/route';
import { HOME_PAGE_PATH } from '@/router';
import type { AppRouteRecord } from '@/types';

/* 菜单状态管理模块
 *
 * 提供菜单数据和动态路由的状态管理
 *
 * ## 主要功能
 *
 * - 菜单列表存储和管理
 * - 首页路径配置
 * - 动态路由注册和移除
 * - 路由移除函数管理
 * - 菜单宽度配置
 *
 * ## 使用场景
 *
 * - 动态菜单加载和渲染
 * - 路由权限控制
 * - 首页路径动态设置
 * - 登出时清理动态路由
 *
 * ## 工作流程
 *
 * 1. 获取菜单数据（前端/后端模式）
 * 2. 设置菜单列表和首页路径
 * 3. 注册动态路由并保存移除函数
 * 4. 登出时调用移除函数清理路由
 *
 */
export interface MenuState {
  homePath: string;
  menuList: AppRouteRecord[];
  menuWidth: number | string;
  setMenuList: (menuList: AppRouteRecord[]) => void;
  setHomePath: (homePath: string) => void;
  removeRouteFns: (() => void)[];
  addRemoveRouteFns: (fns: (() => void)[]) => void;
  removeAllDynamicRoutes: () => void;
  clearRemoveRouteFns: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  homePath: HOME_PAGE_PATH,
  menuList: [],
  menuWidth: 200,
  removeRouteFns: [],

  setMenuList: (menuList) =>
    set({ menuList, homePath: HOME_PAGE_PATH || getFirstMenuPath(menuList) }),
  setHomePath: (homePath) => set({ homePath }),
  addRemoveRouteFns: (fns) =>
    set((state) => ({ removeRouteFns: [...state.removeRouteFns, ...fns] })),
  removeAllDynamicRoutes: () =>
    set((state) => {
      state.removeRouteFns.forEach((fn) => fn());
      return {
        removeRouteFns: [],
      };
    }),
  clearRemoveRouteFns: () => set({ removeRouteFns: [] }),
}));
