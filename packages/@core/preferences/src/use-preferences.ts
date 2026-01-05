import { diff } from '@nova-core/shared/utils';
import { useMemo } from 'react';
import { useStore } from 'zustand';

import { preferencesManager } from './preferences';
import { isDarkTheme } from './update-css-variables';
import type { Preferences } from './types';

function usePreferences() {
  const preferences = useStore(preferencesManager.store);
  const initialPreferences = preferencesManager.getInitialPreferences();
  
  /**
   * @zh_CN 计算偏好设置的变化
   */
  const diffPreference = useMemo(() => {
    return diff(initialPreferences, preferences);
  }, [initialPreferences, preferences]);

  const appPreferences = preferences.app;
  const shortcutKeysPreferences = preferences.shortcutKeys;

  /**
   * @zh_CN 判断是否为暗黑模式
   * @param  preferences - 当前偏好设置对象，它的主题值将被用来判断是否为暗黑模式。
   * @returns 如果主题为暗黑模式，返回 true，否则返回 false。
   */
  const isDark = useMemo(() => {
    return isDarkTheme(preferences.theme.mode);
  }, [preferences.theme.mode]);

  const locale = preferences.app.locale;
  const isMobile = appPreferences.isMobile;

  const theme = isDark ? 'dark' : 'light';

  /**
   * @zh_CN 布局方式
   */
  const layout = isMobile ? 'sidebar-nav' : appPreferences.layout;

  /**
   * @zh_CN 是否显示顶栏
   */
  const isShowHeaderNav = preferences.header.enable;

  /**
   * @zh_CN 是否全屏显示content，不需要侧边、底部、顶部、tab区域
   */
  const isFullContent = appPreferences.layout === 'full-content';

  /**
   * @zh_CN 是否侧边导航模式
   */
  const isSideNav = appPreferences.layout === 'sidebar-nav';

  /**
   * @zh_CN 是否侧边混合模式
   */
  const isSideMixedNav = appPreferences.layout === 'sidebar-mixed-nav';

  /**
   * @zh_CN 是否为头部导航模式
   */
  const isHeaderNav = appPreferences.layout === 'header-nav';

  /**
   * @zh_CN 是否为头部混合导航模式
   */
  const isHeaderMixedNav = appPreferences.layout === 'header-mixed-nav';

  /**
   * @zh_CN 是否为顶部通栏+侧边导航模式
   */
  const isHeaderSidebarNav = appPreferences.layout === 'header-sidebar-nav';

  /**
   * @zh_CN 是否为混合导航模式
   */
  const isMixedNav = appPreferences.layout === 'mixed-nav';

  /**
   * @zh_CN 是否包含侧边导航模式
   */
  const isSideMode = 
      isMixedNav ||
      isSideMixedNav ||
      isSideNav ||
      isHeaderMixedNav ||
      isHeaderSidebarNav;

  const sidebarCollapsed = preferences.sidebar.collapsed;

  /**
   * @zh_CN 是否开启keep-alive
   * 在tabs可见以及开启keep-alive的情况下才开启
   */
  const keepAlive = preferences.tabbar.enable && preferences.tabbar.keepAlive;

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelLeft = appPreferences.authPageLayout === 'panel-left';

  /**
   * @zh_CN 登录注册页面布局是否为左侧
   */
  const authPanelRight = appPreferences.authPageLayout === 'panel-right';

  /**
   * @zh_CN 登录注册页面布局是否为中间
   */
  const authPanelCenter = appPreferences.authPageLayout === 'panel-center';

  /**
   * @zh_CN 内容是否已经最大化
   * 排除 full-content模式
   */
  const contentIsMaximize = useMemo(() => {
    const headerIsHidden = preferences.header.hidden;
    const sidebarIsHidden = preferences.sidebar.hidden;
    return headerIsHidden && sidebarIsHidden && !isFullContent;
  }, [preferences.header.hidden, preferences.sidebar.hidden, isFullContent]);

  /**
   * @zh_CN 是否启用全局搜索快捷键
   */
  const globalSearchShortcutKey = useMemo(() => {
    const { enable, globalSearch } = shortcutKeysPreferences;
    return enable && globalSearch;
  }, [shortcutKeysPreferences]);

  /**
   * @zh_CN 是否启用全局注销快捷键
   */
  const globalLogoutShortcutKey = useMemo(() => {
    const { enable, globalLogout } = shortcutKeysPreferences;
    return enable && globalLogout;
  }, [shortcutKeysPreferences]);

  const globalLockScreenShortcutKey = useMemo(() => {
    const { enable, globalLockScreen } = shortcutKeysPreferences;
    return enable && globalLockScreen;
  }, [shortcutKeysPreferences]);

  /**
   * @zh_CN 偏好设置按钮位置
   */
  const preferencesButtonPosition = useMemo(() => {
    const { enablePreferences, preferencesButtonPosition } = preferences.app;

    // 如果没有启用偏好设置按钮
    if (!enablePreferences) {
      return {
        fixed: false,
        header: false,
      };
    }

    const { header, sidebar } = preferences;
    const headerHidden = header.hidden;
    const sidebarHidden = sidebar.hidden;

    const contentIsMax = headerHidden && sidebarHidden;

    const isHeaderPosition = preferencesButtonPosition === 'header';

    // 如果设置了固定位置
    if (preferencesButtonPosition !== 'auto') {
      return {
        fixed: preferencesButtonPosition === 'fixed',
        header: isHeaderPosition,
      };
    }

    // 如果是全屏模式或者没有固定在顶部，
    const fixed =
      contentIsMax || isFullContent || isMobile || !isShowHeaderNav;

    return {
      fixed,
      header: !fixed,
    };
  }, [preferences.app, preferences.header, preferences.sidebar, isFullContent, isMobile, isShowHeaderNav]);

  return {
    authPanelCenter,
    authPanelLeft,
    authPanelRight,
    contentIsMaximize,
    diffPreference,
    globalLockScreenShortcutKey,
    globalLogoutShortcutKey,
    globalSearchShortcutKey,
    isDark,
    isFullContent,
    isHeaderMixedNav,
    isHeaderNav,
    isHeaderSidebarNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    isSideMode,
    isSideNav,
    keepAlive,
    layout,
    locale,
    preferences,
    preferencesButtonPosition,
    sidebarCollapsed,
    theme,
  };
}

export { usePreferences };
