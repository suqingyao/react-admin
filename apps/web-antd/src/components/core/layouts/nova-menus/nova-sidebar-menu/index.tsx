import { cn } from '@suqingyao/utils';
import { Tooltip } from 'antd';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { RouteObject } from 'react-router';
import { matchRoutes, useLocation, useNavigate } from 'react-router';
import { NovaLogo } from '@/components/core/base/nova-logo';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { NovaIconButton } from '@/components/core/widget/nova-icon-button';
import { Menu, MenuItem, SubMenu } from '@/components/ui/menu';
import AppConfig from '@/config';
import { MenuThemeEnum, MenuTypeEnum } from '@/enums/appEnum';
import { useCommon } from '@/hooks/core/useCommon';
import { useTimeoutFn, useWindowSize } from '@/hooks/shared';
import { handleMenuJump } from '@/lib/navigation/jump';
import { formatMenuTitle } from '@/lib/router';
import { routes } from '@/router/routes';
import { useMenuStore, useSettingStore } from '@/store';
import type { AppRouteRecord } from '@/types/router';
import './style.scss';

const MOBILE_BREAKPOINT = 800;
const ANIMATION_DELAY = 350;
export function NovaSidebarMenu() {
  const showLeftMenu = true;
  const location = useLocation();
  const navigate = useNavigate();
  const {
    menuType,
    dualMenuShowText,
    getMenuTheme,
    setDualMenuShowText,
    menuOpen,
    setMenuOpen,
    uniqueOpened,
  } = useSettingStore();
  const { menuList } = useMenuStore();
  const [showMobileModal, setShowMobileModal] = useState(false);

  const { homePath } = useCommon();

  const firstLevelMenus = useMemo(() => {
    return menuList.filter((menu) => !menu.meta.isHide);
  }, [menuList]);

  const matches = useMemo(
    () => matchRoutes(routes as unknown as RouteObject[], location),
    [location],
  );

  const firstLevelMenuPath = useMemo(() => {
    return matches && matches.length > 1 ? matches[1].route.path : '';
  }, [matches]);

  const routerPath = useMemo(() => {
    const currentRoute = matches?.[matches.length - 1]?.route as any;
    return currentRoute?.meta?.activePath || location.pathname;
  }, [matches, location.pathname]);

  const { width } = useWindowSize();
  const isMobileScreen = useMemo(() => width < MOBILE_BREAKPOINT, [width]);

  const isDualMenu = menuType === MenuTypeEnum.DUAL_MENU;

  const menuTheme = getMenuTheme();
  const menuThemeMode: 'dark' | 'light' | 'auto' =
    menuTheme.theme === MenuThemeEnum.DARK ? 'dark' : 'light';

  const navigateToHome = () => {
    navigate(homePath);
  };

  const toggleDualMenuMode = () => {
    setDualMenuShowText(!dualMenuShowText);
  };

  /**
   * 延迟隐藏移动端模态框（使用 VueUse 的 useTimeoutFn）
   */
  const { start: delayHideMobileModal } = useTimeoutFn(
    () => {
      setShowMobileModal(false);
    },
    ANIMATION_DELAY,
    { immediate: false },
  );

  const toggleMenuVisibility = () => {
    setMenuOpen(!menuOpen);

    if (isMobileScreen) {
      if (!menuOpen) {
        setShowMobileModal(true);
      } else {
        delayHideMobileModal();
      }
    }
  };

  const scrollbarStyle = useMemo(() => {
    const isCollapsed = isDualMenu && !menuOpen;
    return {
      transform: isCollapsed ? 'translateY(-50px)' : 'translateX(0)',
      height: isCollapsed ? 'calc(100% + 50px)' : '100%',
      transition: 'transform 0.3s ease',
    } as React.CSSProperties;
  }, [isDualMenu, menuOpen]);

  const renderMenuTitle = useCallback((item: AppRouteRecord, withBadge = false) => {
    const { title, showBadge, showTextBadge } = item.meta;

    return (
      <div className="flex items-center justify-between w-full">
        <span className="truncate">{formatMenuTitle(title)}</span>
        {withBadge && (
          <>
            {showTextBadge && (
              <span className="ml-2 inline-flex min-w-[20px] justify-center rounded-xl bg-red-500 px-1.5 text-[10px] leading-[14px] text-white">
                {showTextBadge}
              </span>
            )}
            {!showTextBadge && showBadge && (
              <span className="ml-2 size-2 rounded-full bg-red-500" />
            )}
          </>
        )}
      </div>
    );
  }, []);

  const menuRecordMap = useMemo(() => {
    const map = new Map<string, AppRouteRecord>();
    const travel = (list: AppRouteRecord[]) => {
      list.forEach((item) => {
        const key = item.path || item.id || '';
        if (key) {
          map.set(key, item);
        }
        if (item.children?.length) {
          travel(item.children);
        }
      });
    };
    travel(menuList);
    return map;
  }, [menuList]);

  const buildMenuNodes = useCallback(
    (list: AppRouteRecord[]): ReactNode[] =>
      list
        .filter((item) => !item.meta?.isHide)
        .map((item) => {
          const path = item.path || item.id || '';
          if (!path) {
            return null;
          }

          const hasChildren = item.children && item.children.length > 0;
          const badgeText = item.meta?.showTextBadge;
          const badgeType: 'normal' | 'dot' | undefined = badgeText
            ? 'normal'
            : item.meta?.showBadge
              ? 'dot'
              : undefined;
          const badgeVariants = badgeType ? 'destructive' : undefined;

          const commonProps = {
            path,
            icon: item.meta?.icon,
            badge: badgeText,
            badgeType,
            badgeVariants,
          };

          if (hasChildren) {
            return (
              <SubMenu key={path} {...commonProps}>
                {renderMenuTitle(item, true)}
                {buildMenuNodes(item.children!)}
              </SubMenu>
            );
          }

          return (
            <MenuItem key={path} {...commonProps}>
              {renderMenuTitle(item)}
            </MenuItem>
          );
        })
        .filter(Boolean) as ReactNode[],
    [renderMenuTitle],
  );

  const menuNodes = useMemo(() => buildMenuNodes(menuList), [buildMenuNodes, menuList]);

  /**
   * 处理菜单关闭（来自子组件）
   */
  const handleMenuClose = (): void => {
    if (isMobileScreen) {
      setMenuOpen(false);
      delayHideMobileModal();
    }
  };

  const handleMenuSelect = (path: string): void => {
    const target = path ? menuRecordMap.get(path) : undefined;
    if (target) {
      handleMenuJump(target);
      handleMenuClose();
    }
  };

  useEffect(() => {
    if (width < MOBILE_BREAKPOINT) {
      if (menuOpen) {
        setMenuOpen(false);
      } else {
        setShowMobileModal(false);
      }
    } else {
      setShowMobileModal(false);
    }
  }, [width, menuOpen, setMenuOpen]);

  useEffect(() => {
    if (!isMobileScreen) {
      setShowMobileModal(false);
    } else {
      if (menuOpen) {
        setShowMobileModal(true);
      } else {
        delayHideMobileModal();
      }
    }
  }, [menuOpen, delayHideMobileModal, isMobileScreen]);

  if (!isDualMenu && !showLeftMenu) {
    return null;
  }

  return (
    <div className="layout-sidebar">
      {isDualMenu && (
        <div
          className="dual-menu-left"
          style={{
            width: dualMenuShowText ? '60px' : '46px',
            background: menuTheme.background,
          }}>
          <NovaLogo className="logo" onClick={navigateToHome} />
          <ul className="h-[calc(100%-135px)] overflow-auto">
            {firstLevelMenus.map((menu) => (
              <li key={menu.path} onClick={() => handleMenuJump(menu)}>
                <Tooltip title={formatMenuTitle(String(menu.meta.title))}>
                  <div
                    className={cn({
                      'is-active': menu.meta.isFirstLevel
                        ? menu.path === location.pathname
                        : menu.path === firstLevelMenuPath,
                    })}
                    style={{
                      height: dualMenuShowText ? '60px' : '46px',
                    }}>
                    <NovaSvgIcon
                      className="menu-icon text-gray-700 dark:text-gray-800"
                      icon={menu.meta.icon!}
                      style={{ marginBottom: dualMenuShowText ? '5px' : '0' }}
                    />
                    {dualMenuShowText && (
                      <span className="text-sm text-gray-700">
                        {formatMenuTitle(String(menu.meta.title))}
                      </span>
                    )}
                    {menu.meta.showBadge && <div className="nova-badge nova-badge-dual" />}
                  </div>
                </Tooltip>
              </li>
            ))}
          </ul>
          <NovaIconButton
            className="switch-menu-btn size-10"
            icon="ri:arrow-left-right-line"
            onClick={toggleDualMenuMode}
          />
        </div>
      )}
      {menuList.length > 0 && (
        <div
          className={cn(
            'menu-left',
            `menu-left-${menuTheme.theme}`,
            `menu-left-${!menuOpen ? 'closed' : 'open'}`,
          )}>
          <div style={scrollbarStyle}>
            <div
              className="header"
              onClick={navigateToHome}
              style={{ background: menuTheme.background }}>
              {!isDualMenu && <NovaLogo className="logo" />}
              <p
                className={cn({ 'is-dual-menu-name': isDualMenu })}
                style={{
                  color: menuTheme.systemNameColor,
                  opacity: !menuOpen ? 0 : 1,
                }}>
                {AppConfig.systemInfo.name}
              </p>
            </div>
            <Menu
              accordion={uniqueOpened}
              collapse={!menuOpen}
              defaultActive={routerPath}
              mode="vertical"
              onSelect={(path) => handleMenuSelect(path)}
              theme={menuThemeMode}>
              {menuNodes}
            </Menu>
          </div>

          {isDualMenu && (
            <div className="dual-menu-collapse-btn" onClick={toggleMenuVisibility}>
              <NovaSvgIcon
                className="text-g-500/70"
                icon={menuOpen ? 'ri:arrow-left-wide-fill' : 'ri:arrow-right-wide-fill'}
              />
            </div>
          )}

          <div
            className="menu-model"
            onClick={toggleMenuVisibility}
            style={{
              opacity: !menuOpen ? 0 : 1,
              transform: showMobileModal ? 'scale(1)' : 'scale(0)',
            }}
          />
        </div>
      )}
    </div>
  );
}
