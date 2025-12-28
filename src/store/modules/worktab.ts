/**
 * 工作标签页状态管理模块
 *
 * 提供多标签页功能的完整状态管理
 *
 * ## 主要功能
 *
 * - 标签页打开和关闭
 * - 标签页固定和取消固定
 * - 批量关闭（左侧、右侧、其他、全部）
 * - 标签页缓存管理（KeepAlive）
 * - 标签页标题自定义
 * - 标签页路由验证
 * - 动态路由参数处理
 *
 * ## 使用场景
 *
 * - 多标签页导航
 * - 页面缓存控制
 * - 标签页右键菜单
 * - 固定常用页面
 * - 批量关闭标签
 *
 * ## 核心特性
 *
 * - 智能标签页复用（同路由名称复用）
 * - 固定标签页保护（不可关闭）
 * - KeepAlive 缓存排除管理
 * - 路由有效性验证
 * - 首页自动保留
 *
 * ## 持久化
 * - 使用 localStorage 存储
 * - 存储键：sys-v{version}-worktab
 * - 刷新页面保持标签状态
 *
 * @module store/modules/worktab
 * @author Art Design Pro Team
 */

import type { RouteObject } from 'react-router';
import { matchRoutes } from 'react-router';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { HOME_PAGE_PATH } from '@/router/constants';
import { routes } from '@/router/routes';
import type { WorkTab } from '@/types/store';

interface WorktabState {
  current: Partial<WorkTab>;
  opened: WorkTab[];
  keepAliveExclude: string[];
}

interface WorktabActions {
  /** 查找标签页索引 */
  findTabIndex: (path: string) => number;
  /** 获取标签页 */
  getTab: (path: string) => WorkTab | undefined;
  /** 检查标签页是否可关闭 */
  isTabClosable: (tab: WorkTab) => boolean;
  /** 打开或激活一个选项卡 */
  openTab: (tab: WorkTab) => void;
  /** 关闭指定的选项卡 */
  removeTab: (path: string, routerPush: (path: string) => void) => void;
  /** 关闭左侧选项卡 */
  removeLeft: (path: string) => void;
  /** 关闭右侧选项卡 */
  removeRight: (path: string) => void;
  /** 关闭其他选项卡 */
  removeOthers: (path: string) => void;
  /** 关闭所有可关闭的标签页 */
  removeAll: (routerPush: (path: string) => void) => void;
  /** 将指定选项卡添加到 keepAlive 排除列表中 */
  addKeepAliveExclude: (tab: WorkTab) => void;
  /** 从 keepAlive 排除列表中移除指定组件名称 */
  removeKeepAliveExclude: (name: string) => void;
  /** 将传入的一组选项卡的组件名称标记为排除缓存 */
  markTabsToRemove: (tabs: WorkTab[]) => void;
  /** 切换指定标签页的固定状态 */
  toggleFixedTab: (path: string) => void;
  /** 验证工作台标签页的路由有效性 */
  validateWorktabs: () => void;
  /** 清空所有状态 */
  clearAll: () => void;
  /** 获取状态快照 */
  getStateSnapshot: () => WorktabState;
  /** 获取标签页标题 */
  getTabTitle: (path: string) => WorkTab | undefined;
  /** 更新标签页标题 */
  updateTabTitle: (path: string, title: string) => void;
  /** 重置标签页标题 */
  resetTabTitle: (path: string) => void;
}

export const useWorktabStore = create<WorktabState & WorktabActions>()(
  devtools(
    persist(
      (set, get) => ({
        // 状态定义
        current: {},
        opened: [],
        keepAliveExclude: [],

        // Actions
        findTabIndex: (path: string): number => {
          return get().opened.findIndex((tab) => tab.path === path);
        },

        getTab: (path: string): WorkTab | undefined => {
          return get().opened.find((tab) => tab.path === path);
        },

        isTabClosable: (tab: WorkTab): boolean => {
          return !tab.fixedTab;
        },

        openTab: (tab: WorkTab): void => {
          if (!tab.path) {
            console.warn('尝试打开无效的标签页');
            return;
          }

          const state = get();
          // 从 keepAlive 排除列表中移除
          if (tab.name) {
            state.removeKeepAliveExclude(tab.name);
          }

          // 先根据路由名称查找（应对动态路由参数导致的多开问题），找不到再根据路径查找
          let existingIndex = -1;
          if (tab.name) {
            existingIndex = state.opened.findIndex((t) => t.name === tab.name);
          }
          if (existingIndex === -1) {
            existingIndex = state.findTabIndex(tab.path);
          }

          if (existingIndex === -1) {
            // 新增标签页
            // 查找固定标签页的插入位置
            let insertIndex = 0;
            for (let i = 0; i < state.opened.length; i++) {
              if (state.opened[i].fixedTab) {
                insertIndex = i + 1;
              } else {
                break;
              }
            }
            if (!tab.fixedTab) insertIndex = state.opened.length;

            const newTab = { ...tab };
            const newOpened = [...state.opened];

            if (tab.fixedTab) {
              newOpened.splice(insertIndex, 0, newTab);
            } else {
              newOpened.push(newTab);
            }

            set({ opened: newOpened, current: newTab });
          } else {
            // 更新现有标签页（当动态路由参数或查询变更时，复用同一标签）
            const existingTab = state.opened[existingIndex];
            const updatedTab = {
              ...existingTab,
              path: tab.path,
              params: tab.params,
              query: tab.query,
              title: tab.title || existingTab.title,
              fixedTab: tab.fixedTab ?? existingTab.fixedTab,
              keepAlive: tab.keepAlive ?? existingTab.keepAlive,
              name: tab.name || existingTab.name,
              icon: tab.icon || existingTab.icon,
            };

            const newOpened = [...state.opened];
            newOpened[existingIndex] = updatedTab;

            set({ opened: newOpened, current: updatedTab });
          }
        },

        removeTab: (path: string, routerPush: (path: string) => void): void => {
          const state = get();
          const targetTab = state.getTab(path);
          const targetIndex = state.findTabIndex(path);

          if (targetIndex === -1) {
            console.warn(`尝试关闭不存在的标签页: ${path}`);
            return;
          }

          if (targetTab && !state.isTabClosable(targetTab)) {
            console.warn(`尝试关闭固定标签页: ${path}`);
            return;
          }

          // 从标签页列表中移除
          const newOpened = [...state.opened];
          newOpened.splice(targetIndex, 1);

          // 处理缓存排除
          if (targetTab?.name) {
            state.addKeepAliveExclude(targetTab);
          }

          // 如果关闭后无标签页，跳转首页
          if (newOpened.length === 0) {
            if (path !== HOME_PAGE_PATH) {
              set({ current: {}, opened: newOpened });
              routerPush(HOME_PAGE_PATH);
            } else {
              set({ opened: newOpened });
            }
            return;
          }

          // 如果关闭的是当前激活标签，需要激活其他标签
          let newCurrent = state.current;
          if (state.current.path === path) {
            const newIndex = targetIndex >= newOpened.length ? newOpened.length - 1 : targetIndex;
            newCurrent = newOpened[newIndex];
            routerPush(newCurrent.path!);
          }

          set({ opened: newOpened, current: newCurrent });
        },

        removeLeft: (path: string): void => {
          const state = get();
          const targetIndex = state.findTabIndex(path);

          if (targetIndex === -1) {
            console.warn(`尝试关闭左侧标签页，但目标标签页不存在: ${path}`);
            return;
          }

          // 获取左侧可关闭的标签页
          const leftTabs = state.opened.slice(0, targetIndex);
          const closableLeftTabs = leftTabs.filter(state.isTabClosable);

          if (closableLeftTabs.length === 0) {
            console.warn('左侧没有可关闭的标签页');
            return;
          }

          // 标记为缓存排除
          state.markTabsToRemove(closableLeftTabs);

          // 移除左侧可关闭的标签页
          const newOpened = state.opened.filter(
            (tab, index) => index >= targetIndex || !state.isTabClosable(tab),
          );

          // 确保当前标签是激活状态
          const targetTab = state.getTab(path);
          const newCurrent = targetTab ? targetTab : state.current;

          set({ opened: newOpened, current: newCurrent });
        },

        removeRight: (path: string): void => {
          const state = get();
          const targetIndex = state.findTabIndex(path);

          if (targetIndex === -1) {
            console.warn(`尝试关闭右侧标签页，但目标标签页不存在: ${path}`);
            return;
          }

          // 获取右侧可关闭的标签页
          const rightTabs = state.opened.slice(targetIndex + 1);
          const closableRightTabs = rightTabs.filter(state.isTabClosable);

          if (closableRightTabs.length === 0) {
            console.warn('右侧没有可关闭的标签页');
            return;
          }

          // 标记为缓存排除
          state.markTabsToRemove(closableRightTabs);

          // 移除右侧可关闭的标签页
          const newOpened = state.opened.filter(
            (tab, index) => index <= targetIndex || !state.isTabClosable(tab),
          );

          // 确保当前标签是激活状态
          const targetTab = state.getTab(path);
          const newCurrent = targetTab ? targetTab : state.current;

          set({ opened: newOpened, current: newCurrent });
        },

        removeOthers: (path: string): void => {
          const state = get();
          const targetTab = state.getTab(path);

          if (!targetTab) {
            console.warn(`尝试关闭其他标签页，但目标标签页不存在: ${path}`);
            return;
          }

          // 获取其他可关闭的标签页
          const otherTabs = state.opened.filter((tab) => tab.path !== path);
          const closableTabs = otherTabs.filter(state.isTabClosable);

          if (closableTabs.length === 0) {
            console.warn('没有其他可关闭的标签页');
            return;
          }

          // 标记为缓存排除
          state.markTabsToRemove(closableTabs);

          // 只保留当前标签和固定标签
          const newOpened = state.opened.filter(
            (tab) => tab.path === path || !state.isTabClosable(tab),
          );

          set({ opened: newOpened, current: targetTab });
        },

        removeAll: (routerPush: (path: string) => void): void => {
          const state = get();
          const hasFixedTabs = state.opened.some((tab) => tab.fixedTab);

          // 获取可关闭的标签页
          const closableTabs = state.opened.filter((tab) => {
            if (!state.isTabClosable(tab)) return false;
            // 如果有固定标签，则所有可关闭的都可以关闭；否则保留首页
            return hasFixedTabs || tab.path !== HOME_PAGE_PATH;
          });

          if (closableTabs.length === 0) {
            console.warn('没有可关闭的标签页');
            return;
          }

          // 标记为缓存排除
          state.markTabsToRemove(closableTabs);

          // 保留不可关闭的标签页和首页（当没有固定标签时）
          const newOpened = state.opened.filter((tab) => {
            return !state.isTabClosable(tab) || (!hasFixedTabs && tab.path === HOME_PAGE_PATH);
          });

          // 处理激活状态
          if (newOpened.length === 0) {
            set({ current: {}, opened: newOpened });
            routerPush(HOME_PAGE_PATH);
            return;
          }

          // 选择激活的标签页：优先首页，其次第一个可用标签
          const homeTab = newOpened.find((tab) => tab.path === HOME_PAGE_PATH);
          const targetTab = homeTab || newOpened[0];

          set({ opened: newOpened, current: targetTab });
          routerPush(targetTab.path!);
        },

        addKeepAliveExclude: (tab: WorkTab): void => {
          if (!tab.keepAlive || !tab.name) return;
          const state = get();
          if (!state.keepAliveExclude.includes(tab.name)) {
            set({ keepAliveExclude: [...state.keepAliveExclude, tab.name] });
          }
        },

        removeKeepAliveExclude: (name: string): void => {
          if (!name) return;
          const state = get();
          set({ keepAliveExclude: state.keepAliveExclude.filter((item) => item !== name) });
        },

        markTabsToRemove: (tabs: WorkTab[]): void => {
          const state = get();
          tabs.forEach((tab) => {
            if (tab.name) {
              state.addKeepAliveExclude(tab);
            }
          });
        },

        toggleFixedTab: (path: string): void => {
          const state = get();
          const targetIndex = state.findTabIndex(path);

          if (targetIndex === -1) {
            console.warn(`尝试切换不存在标签页的固定状态: ${path}`);
            return;
          }

          const newOpened = [...state.opened];
          const tab = { ...newOpened[targetIndex] };
          tab.fixedTab = !tab.fixedTab;

          // 移除原位置
          newOpened.splice(targetIndex, 1);

          if (tab.fixedTab) {
            // 固定标签插入到所有固定标签的末尾
            const firstNonFixedIndex = newOpened.findIndex((t) => !t.fixedTab);
            const insertIndex = firstNonFixedIndex === -1 ? newOpened.length : firstNonFixedIndex;
            newOpened.splice(insertIndex, 0, tab);
          } else {
            // 非固定标签插入到所有固定标签后
            const fixedCount = newOpened.filter((t) => t.fixedTab).length;
            newOpened.splice(fixedCount, 0, tab);
          }

          const newState: Partial<WorktabState> = { opened: newOpened };

          // 更新当前标签引用
          if (state.current.path === path) {
            newState.current = tab;
          }

          set(newState);
        },

        validateWorktabs: (): void => {
          try {
            const state = get();
            // 动态路由校验
            const isTabRouteValid = (tab: Partial<WorkTab>): boolean => {
              try {
                if (!tab.path) return false;
                // 使用 matchRoutes 验证路径是否匹配路由配置
                const matched = matchRoutes(routes as unknown as RouteObject[], tab.path);
                return !!matched && matched.length > 0;
              } catch {
                return false;
              }
            };

            // 过滤出有效的标签页
            const validTabs = state.opened.filter((tab) => isTabRouteValid(tab));

            const newState: Partial<WorktabState> = {};

            if (validTabs.length !== state.opened.length) {
              console.warn('发现无效的标签页路由，已自动清理');
              newState.opened = validTabs;
            }

            // 验证当前激活标签的有效性
            const isCurrentValid = state.current && isTabRouteValid(state.current);

            if (!isCurrentValid && validTabs.length > 0) {
              console.warn('当前激活标签无效，已自动切换');
              newState.current = validTabs[0];
            } else if (!isCurrentValid) {
              newState.current = {};
            }

            if (Object.keys(newState).length > 0) {
              set(newState);
            }
          } catch (error) {
            console.error('验证工作台标签页失败:', error);
          }
        },

        clearAll: (): void => {
          set({
            current: {},
            opened: [],
            keepAliveExclude: [],
          });
        },

        getStateSnapshot: (): WorktabState => {
          const state = get();
          return {
            current: { ...state.current },
            opened: [...state.opened],
            keepAliveExclude: [...state.keepAliveExclude],
          };
        },

        getTabTitle: (path: string): WorkTab | undefined => {
          return get().getTab(path);
        },

        updateTabTitle: (path: string, title: string): void => {
          const state = get();
          const tabIndex = state.findTabIndex(path);
          if (tabIndex !== -1) {
            const newOpened = [...state.opened];
            newOpened[tabIndex] = { ...newOpened[tabIndex], customTitle: title };
            set({ opened: newOpened });
          }
        },

        resetTabTitle: (path: string): void => {
          const state = get();
          const tabIndex = state.findTabIndex(path);
          if (tabIndex !== -1) {
            const newOpened = [...state.opened];
            newOpened[tabIndex] = { ...newOpened[tabIndex], customTitle: '' };
            set({ opened: newOpened });
          }
        },
      }),
      {
        name: 'worktab-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: 'worktab-store',
    },
  ),
);
