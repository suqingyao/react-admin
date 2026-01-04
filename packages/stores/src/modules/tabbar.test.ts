import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTabbarStore } from './tabbar';

describe('useTabbarStore', () => {
  const router: any = {
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { fullPath: '', meta: {}, name: '', path: '' } },
  };

  beforeEach(() => {
    useTabbarStore.setState({
      cachedTabs: new Set(),
      tabs: [],
      excludeCachedTabs: new Set(),
      renderRouteView: true,
    });
    vi.clearAllMocks();
  });

  it('adds a new tab', () => {
    const tab: any = {
      fullPath: '/home',
      meta: {},
      key: '/home',
      name: 'Home',
      path: '/home',
    };
    useTabbarStore.getState().addTab(tab);
    expect(useTabbarStore.getState().tabs.length).toBe(1);
    expect(useTabbarStore.getState().tabs[0]).toEqual(expect.objectContaining(tab));
  });

  it('adds a new tab if it does not exist', () => {
    const newTab: any = {
      fullPath: '/new',
      meta: {},
      name: 'New',
      path: '/new',
    };
    useTabbarStore.getState().addTab(newTab);
    expect(useTabbarStore.getState().tabs).toEqual(
      expect.arrayContaining([expect.objectContaining(newTab)]),
    );
  });

  it('updates an existing tab instead of adding a new one', () => {
    const initialTab: any = {
      fullPath: '/existing',
      meta: {
        fullPathKey: false,
      },
      name: 'Existing',
      path: '/existing',
      query: {},
    };
    useTabbarStore.getState().addTab(initialTab);
    const updatedTab = { ...initialTab, query: { id: '1' } };
    useTabbarStore.getState().addTab(updatedTab);
    expect(useTabbarStore.getState().tabs.length).toBe(1);
    expect(useTabbarStore.getState().tabs[0]?.query).toEqual({ id: '1' });
  });

  it('closes all tabs', async () => {
    useTabbarStore.getState().addTab({
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    } as any);

    await useTabbarStore.getState().closeAllTabs(router);
    expect(useTabbarStore.getState().tabs.length).toBe(1);
  });

  it('closes a non-affix tab', () => {
    const tab: any = {
      fullPath: '/closable',
      meta: {},
      name: 'Closable',
      path: '/closable',
    };
    useTabbarStore.getState().addTab(tab);
    useTabbarStore.getState()._close(tab);
    expect(useTabbarStore.getState().tabs.length).toBe(0);
  });

  it('does not close an affix tab', () => {
    const affixTab: any = {
      fullPath: '/affix',
      meta: { affixTab: true },
      name: 'Affix',
      path: '/affix',
    };
    useTabbarStore.getState().addTab(affixTab);
    useTabbarStore.getState()._close(affixTab);
    expect(useTabbarStore.getState().tabs.length).toBe(1);
  });

  it('returns all cache tabs', () => {
    useTabbarStore.setState({ cachedTabs: new Set(['Home', 'About']) });
    expect(useTabbarStore.getState().getCachedTabs()).toEqual(['Home', 'About']);
  });

  it('navigates to a specific tab', async () => {
    const tab: any = { meta: {}, name: 'Dashboard', path: '/dashboard' };
    await useTabbarStore.getState()._goToTab(tab, router);
    expect(router.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/dashboard',
      }),
    );
  });

  it('closes multiple tabs by paths', async () => {
    const store = useTabbarStore.getState();
    store.addTab({ fullPath: '/home', meta: {}, name: 'Home', path: '/home' } as any);
    store.addTab({ fullPath: '/about', meta: {}, name: 'About', path: '/about' } as any);
    store.addTab({ fullPath: '/contact', meta: {}, name: 'Contact', path: '/contact' } as any);

    await store._bulkCloseByKeys(['/home', '/contact']);
    expect(useTabbarStore.getState().tabs).toHaveLength(1);
    expect(useTabbarStore.getState().tabs[0]?.name).toBe('About');
  });
});
