import { preferences } from '@nova-core/preferences';
import type { TabDefinition } from '@nova-core/typings';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Mock types for migration
type Router = any;
type RouteRecordNormalized = any;
type RouteLocationNormalized = any;

interface TabbarState {
  cachedTabs: Set<string>;
  dragEndIndex: number;
  excludeCachedTabs: Set<string>;
  menuList: string[];
  renderRouteView?: boolean;
  tabs: TabDefinition[];
  updateTime?: number;

  // Getters (as functions/computed)
  getAffixTabs: () => TabDefinition[];
  getCachedTabs: () => string[];
  getExcludeCachedTabs: () => string[];
  getTabs: () => TabDefinition[];

  // Actions
  addTab: (routeTab: TabDefinition) => TabDefinition;
  closeAllTabs: (router: Router) => Promise<void>;
  closeLeftTabs: (tab: TabDefinition) => Promise<void>;
  closeOtherTabs: (tab: TabDefinition) => Promise<void>;
  closeRightTabs: (tab: TabDefinition) => Promise<void>;
  closeTab: (tab: TabDefinition, router: Router) => Promise<void>;
  closeTabByKey: (key: string, router: Router) => Promise<void>;
  getTabByKey: (key: string) => TabDefinition | undefined;
  pinTab: (tab: TabDefinition) => Promise<void>;
  refresh: (router: Router | string) => Promise<void>;
  refreshByName: (name: string) => Promise<void>;
  resetTabTitle: (tab: TabDefinition) => Promise<void>;
  setAffixTabs: (tabs: RouteRecordNormalized[]) => void;
  setMenuList: (list: string[]) => void;
  setTabTitle: (tab: TabDefinition, title: string) => Promise<void>;
  setUpdateTime: () => void;
  sortTabs: (oldIndex: number, newIndex: number) => Promise<void>;
  toggleTabPin: (tab: TabDefinition) => Promise<void>;
  unpinTab: (tab: TabDefinition) => Promise<void>;
  updateCacheTabs: () => Promise<void>;

  // Internal/Private helpers exposed if needed
  _bulkCloseByKeys: (keys: string[]) => Promise<void>;
  _close: (tab: TabDefinition) => void;
  _goToDefaultTab: (router: Router) => Promise<void>;
  _goToTab: (tab: TabDefinition, router: Router) => Promise<void>;
}

export const useTabbarStore = create<TabbarState>()(
  persist(
    (set, get) => ({
      cachedTabs: new Set(),
      dragEndIndex: 0,
      excludeCachedTabs: new Set(),
      menuList: [
        'close',
        'affix',
        'maximize',
        'reload',
        'open-in-new-window',
        'close-left',
        'close-right',
        'close-other',
        'close-all',
      ],
      renderRouteView: true,
      tabs: [],
      updateTime: Date.now(),

      // Getters
      getAffixTabs: () => {
        const { tabs } = get();
        return tabs
          .filter(isAffixTab)
          .sort((a, b) => (a.meta?.affixTabOrder ?? 0) - (b.meta?.affixTabOrder ?? 0));
      },
      getCachedTabs: () => [...get().cachedTabs],
      getExcludeCachedTabs: () => [...get().excludeCachedTabs],
      getTabs: () => {
        const { tabs } = get();
        const affixTabs = tabs
          .filter(isAffixTab)
          .sort((a, b) => (a.meta?.affixTabOrder ?? 0) - (b.meta?.affixTabOrder ?? 0));
        const normalTabs = tabs.filter((tab) => !isAffixTab(tab));
        return [...affixTabs, ...normalTabs].filter(Boolean);
      },

      // Actions
      _bulkCloseByKeys: async (keys) => {
        const keySet = new Set(keys);
        const { tabs, updateCacheTabs } = get();
        const newTabs = tabs.filter((item) => !keySet.has(getTabKeyFromTab(item)));
        set({ tabs: newTabs });
        await updateCacheTabs();
      },

      _close: (tab) => {
        if (isAffixTab(tab)) return;
        const { tabs } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index !== -1) {
          const newTabs = [...tabs];
          newTabs.splice(index, 1);
          set({ tabs: newTabs });
        }
      },

      _goToDefaultTab: async (router) => {
        const tabs = get().getTabs();
        if (tabs.length <= 0) return;
        const firstTab = tabs[0];
        if (firstTab) {
          await get()._goToTab(firstTab, router);
        }
      },

      _goToTab: async (tab, router) => {
        const { params, path, query } = tab;
        // Mocking router behavior. In React Router: navigate(path, { state: params, search: query })
        if (router && typeof router.replace === 'function') {
          await router.replace({
            pathname: path,
            search: new URLSearchParams(query as any).toString(),
            // params handling depends on router version/setup
          });
        }
      },

      addTab: (routeTab) => {
        let tab = cloneTab(routeTab);
        if (!tab.key) {
          tab.key = getTabKey(routeTab);
        }
        if (!isTabShown(tab)) return tab;

        const { tabs, updateCacheTabs } = get();
        const tabIndex = tabs.findIndex((item) => equalTab(item, tab));
        const newTabs = [...tabs];

        if (tabIndex === -1) {
          const maxCount = preferences.tabbar.maxCount;
          const maxNumOfOpenTab = (routeTab?.meta?.maxNumOfOpenTab ?? -1) as number;

          if (
            maxNumOfOpenTab > 0 &&
            tabs.filter((t) => t.name === routeTab.name).length >= maxNumOfOpenTab
          ) {
            const index = tabs.findIndex((item) => item.name === routeTab.name);
            if (index !== -1) newTabs.splice(index, 1);
          } else if (maxCount > 0 && tabs.length >= maxCount) {
            const index = tabs.findIndex((item) => !isAffixTab(item));
            if (index !== -1) newTabs.splice(index, 1);
          }
          newTabs.push(tab);
        } else {
          const currentTab = tabs[tabIndex];
          const mergedTab = {
            ...currentTab,
            ...tab,
            meta: { ...currentTab?.meta, ...tab.meta },
          };
          if (currentTab) {
            if (currentTab.meta?.affixTab) mergedTab.meta.affixTab = currentTab.meta.affixTab;
            if (currentTab.meta?.newTabTitle)
              mergedTab.meta.newTabTitle = currentTab.meta.newTabTitle;
          }
          tab = mergedTab;
          newTabs[tabIndex] = mergedTab;
        }

        set({ tabs: newTabs });
        updateCacheTabs();
        return tab;
      },

      closeAllTabs: async (router) => {
        const { tabs, _goToDefaultTab, updateCacheTabs } = get();
        const newTabs = tabs.filter(isAffixTab);
        set({ tabs: newTabs.length > 0 ? newTabs : [...tabs].slice(0, 1) });
        await _goToDefaultTab(router);
        await updateCacheTabs();
      },

      closeLeftTabs: async (tab) => {
        const { tabs, _bulkCloseByKeys } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index < 1) return;

        const leftTabs = tabs.slice(0, index);
        const keys: string[] = [];
        for (const item of leftTabs) {
          if (!isAffixTab(item)) keys.push(item.key as string);
        }
        await _bulkCloseByKeys(keys);
      },

      closeOtherTabs: async (tab) => {
        const { tabs, _bulkCloseByKeys } = get();
        const currentKey = getTabKeyFromTab(tab);
        const keys: string[] = [];
        for (const item of tabs) {
          const key = getTabKeyFromTab(item);
          if (key !== currentKey && !isAffixTab(item)) {
            keys.push(item.key as string);
          }
        }
        await _bulkCloseByKeys(keys);
      },

      closeRightTabs: async (tab) => {
        const { tabs, _bulkCloseByKeys } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index !== -1 && index < tabs.length - 1) {
          const rightTabs = tabs.slice(index + 1);
          const keys: string[] = [];
          for (const item of rightTabs) {
            if (!isAffixTab(item)) keys.push(item.key as string);
          }
          await _bulkCloseByKeys(keys);
        }
      },

      closeTab: async (tab, router) => {
        const { getTabs, _close, updateCacheTabs, _goToTab } = get();
        // TODO: Need current route from router or store
        // Assuming router has currentRoute object for now
        const currentRoute = router?.currentRoute?.value || router?.location || {};

        if (getTabKey(currentRoute) !== getTabKeyFromTab(tab)) {
          _close(tab);
          await updateCacheTabs();
          return;
        }

        const tabs = getTabs();
        const index = tabs.findIndex((item) => getTabKeyFromTab(item) === getTabKey(currentRoute));
        const before = tabs[index - 1];
        const after = tabs[index + 1];

        if (after) {
          _close(tab);
          await _goToTab(after, router);
        } else if (before) {
          _close(tab);
          await _goToTab(before, router);
        } else {
          console.error('Failed to close the tab; only one tab remains open.');
        }
      },

      closeTabByKey: async (key, router) => {
        const { tabs, closeTab } = get();
        const originKey = decodeURIComponent(key);
        const index = tabs.findIndex((item) => getTabKeyFromTab(item) === originKey);
        if (index !== -1) {
          await closeTab(tabs[index], router);
        }
      },

      getTabByKey: (key) => {
        const { getTabs } = get();
        return getTabs().find((item) => getTabKeyFromTab(item) === key);
      },

      pinTab: async (tab) => {
        const { tabs, sortTabs } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index === -1) return;

        const newTabs = [...tabs];
        const oldTab = newTabs[index];
        // Create a copy to modify
        const updatedTab = {
          ...tab,
          meta: { ...tab.meta, affixTab: true, title: oldTab.meta?.title },
        };
        newTabs[index] = updatedTab;
        set({ tabs: newTabs });

        const affixTabs = newTabs.filter(isAffixTab);
        const newIndex = affixTabs.findIndex((item) => equalTab(item, updatedTab));
        await sortTabs(index, newIndex);
      },

      refresh: async (router) => {
        const { excludeCachedTabs } = get();
        let name: string = '';
        if (typeof router === 'string') {
          name = router;
        } else {
          name = router?.currentRoute?.value?.name || '';
        }

        if (!name) return;

        const newExclude = new Set(excludeCachedTabs);
        newExclude.add(name);
        set({ excludeCachedTabs: newExclude, renderRouteView: false });

        // Mock progress start

        await new Promise((resolve) => setTimeout(resolve, 200));

        newExclude.delete(name);
        set({ excludeCachedTabs: newExclude, renderRouteView: true });

        // Mock progress end
      },

      refreshByName: async (name) => {
        const { excludeCachedTabs } = get();
        const newExclude = new Set(excludeCachedTabs);
        newExclude.add(name);
        set({ excludeCachedTabs: newExclude });
        await new Promise((resolve) => setTimeout(resolve, 200));
        newExclude.delete(name);
        set({ excludeCachedTabs: newExclude });
      },

      resetTabTitle: async (tab) => {
        if (tab?.meta?.newTabTitle) return;
        const { tabs, updateCacheTabs } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index !== -1) {
          const newTabs = [...tabs];
          newTabs[index] = {
            ...newTabs[index],
            meta: { ...newTabs[index].meta, newTabTitle: undefined },
          };
          set({ tabs: newTabs });
          await updateCacheTabs();
        }
      },

      setAffixTabs: (tabs) => {
        const { addTab } = get();
        for (const tab of tabs) {
          const tabDef = routeToTab(tab);
          tabDef.meta.affixTab = true;
          addTab(tabDef);
        }
      },

      setMenuList: (list) => set({ menuList: list }),

      setTabTitle: async (tab, title) => {
        const { tabs, updateCacheTabs } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index !== -1) {
          const newTabs = [...tabs];
          newTabs[index] = {
            ...newTabs[index],
            meta: { ...newTabs[index].meta, newTabTitle: title },
          };
          set({ tabs: newTabs });
          await updateCacheTabs();
        }
      },

      setUpdateTime: () => set({ updateTime: Date.now() }),

      sortTabs: async (oldIndex, newIndex) => {
        const { tabs, dragEndIndex } = get();
        const currentTab = tabs[oldIndex];
        if (!currentTab) return;

        const newTabs = [...tabs];
        newTabs.splice(oldIndex, 1);
        newTabs.splice(newIndex, 0, currentTab);
        set({ tabs: newTabs, dragEndIndex: dragEndIndex + 1 });
      },

      toggleTabPin: async (tab) => {
        const { unpinTab, pinTab } = get();
        const affixTab = tab?.meta?.affixTab ?? false;
        await (affixTab ? unpinTab(tab) : pinTab(tab));
      },

      unpinTab: async (tab) => {
        const { tabs, sortTabs } = get();
        const index = tabs.findIndex((item) => equalTab(item, tab));
        if (index === -1) return;

        const newTabs = [...tabs];
        const oldTab = newTabs[index];
        const updatedTab = {
          ...tab,
          meta: { ...tab.meta, affixTab: false, title: oldTab.meta?.title },
        };
        newTabs[index] = updatedTab;
        set({ tabs: newTabs });

        const affixTabs = newTabs.filter(isAffixTab);
        const newIndex = affixTabs.length;
        await sortTabs(index, newIndex);
      },

      updateCacheTabs: async () => {
        const { tabs } = get();
        const cacheMap = new Set<string>();
        for (const tab of tabs) {
          if (!tab.meta?.keepAlive) continue;

          (tab.matched || []).forEach((t: any, i: number) => {
            if (i > 0) cacheMap.add(t.name as string);
          });
          cacheMap.add(tab.name as string);
        }
        set({ cachedTabs: cacheMap });
      },

      openTabInNewWindow: async (tab) => {
        // Implement based on utility availability
      },
    }),
    {
      name: 'core-tabbar',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tabs: state.tabs,
      }),
    },
  ),
);

// Helpers
function cloneTab(route: TabDefinition): TabDefinition {
  if (!route) return route;
  const { matched, meta, ...opt } = route;
  return {
    ...opt,
    matched: matched
      ? (matched.map((item: any) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        })) as RouteRecordNormalized[])
      : undefined,
    meta: { ...meta, newTabTitle: meta?.newTabTitle },
  };
}

function isAffixTab(tab: TabDefinition) {
  return tab?.meta?.affixTab ?? false;
}

function isTabShown(tab: TabDefinition) {
  const matched = tab?.matched ?? [];
  return !tab.meta.hideInTab && matched.every((item: any) => !item.meta.hideInTab);
}

export function getTabKey(tab: RouteLocationNormalized | RouteRecordNormalized) {
  const { fullPath, path, meta, query = {} } = tab as RouteLocationNormalized;
  const fullPathKey = meta?.fullPathKey;

  const pageKey = Array.isArray(query.pageKey) ? query.pageKey[0] : query.pageKey;
  let rawKey;
  if (pageKey) {
    rawKey = pageKey;
  } else {
    rawKey = fullPathKey === false ? path : (fullPath ?? path);
  }
  try {
    return decodeURIComponent(rawKey);
  } catch {
    return rawKey;
  }
}

function getTabKeyFromTab(tab: TabDefinition): string {
  return tab.key ?? getTabKey(tab);
}

function equalTab(a: TabDefinition, b: TabDefinition) {
  return getTabKeyFromTab(a) === getTabKeyFromTab(b);
}

function routeToTab(route: RouteRecordNormalized) {
  return {
    meta: route.meta,
    name: route.name,
    path: route.path,
    key: getTabKey(route),
  } as TabDefinition;
}
