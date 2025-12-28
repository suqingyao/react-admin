import { cn } from '@suqingyao/utils';
import type { MenuProps } from 'antd';
import { Menu, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { RouteObject } from 'react-router';
import { matchRoutes, useLocation, useNavigate } from 'react-router';
import { NovaLogo } from '@/components/core/base/nova-logo';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { NovaIconButton } from '@/components/core/widget/nova-icon-button';
import AppConfig from '@/config';
import { MenuTypeEnum, MenuWidth } from '@/enums/appEnum';
import { useCommon } from '@/hooks/core/useCommon';
import { useTimeoutFn, useWindowSize } from '@/hooks/shared';
import { handleMenuJump } from '@/lib/navigation/jump';
import { routes } from '@/router/routes';
import { useMenuStore, useSettingStore } from '@/store';
import type { AppRouteRecord } from '@/types/router';
import './style.scss';

type MenuItem = Required<MenuProps>['items'][number];

const MOBILE_BREAKPOINT = 800;
const ANIMATION_DELAY = 350;
const MENU_CLOSE_WIDTH = MenuWidth.CLOSE;

export function NovaSidebarMenu() {
  const showLeftMenu = true;
  const location = useLocation();
  const navigate = useNavigate();
  const { menuType, dualMenuShowText, getMenuTheme, setDualMenuShowText, menuOpen, setMenuOpen } =
    useSettingStore();
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

  const getMenuItems = (list: AppRouteRecord[]): MenuItem[] => {
    return list
      .filter((item) => !item.meta?.isHide)
      .map((item) => {
        const menuItem: MenuItem = {
          key: item.path || item.id || '',
          icon: item.meta?.icon ? <NovaSvgIcon icon={item.meta.icon} className="size-4" /> : null,
          label: (
            <div className="flex items-center justify-between">
              <span>{item.meta.title}</span>
              {item.meta.showBadge && <span className="ml-2 size-2 rounded-full bg-red-500" />}
            </div>
          ),
          onClick: () => {
            handleMenuJump(item);
            handleMenuClose();
          },
          children:
            item.children && item.children.length > 0 ? getMenuItems(item.children) : undefined,
        };
        return menuItem;
      });
  };

  const menuItems = useMemo(() => getMenuItems(menuList), [menuList, getMenuItems]);

  /**
   * 处理菜单关闭（来自子组件）
   */
  const handleMenuClose = (): void => {
    if (isMobileScreen) {
      setMenuOpen(false);
      delayHideMobileModal();
    }
  };

  useEffect(() => {
    if (width < MOBILE_BREAKPOINT) {
      setMenuOpen(false);
      if (!menuOpen) {
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
            background: getMenuTheme().background,
          }}>
          <NovaLogo className="logo" onClick={navigateToHome} />
          <ul className="h-[calc(100%-135px)] overflow-auto">
            {firstLevelMenus.map((menu) => (
              <li key={menu.path} onClick={() => handleMenuJump(menu)}>
                <Tooltip title={menu.meta.title}>
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
                      <span className="text-sm text-gray-700">{menu.meta.title}</span>
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
            `menu-left-${getMenuTheme().theme}`,
            `menu-left-${!menuOpen ? 'closed' : 'open'}`,
          )}>
          <div style={scrollbarStyle}>
            <div
              className="header"
              onClick={navigateToHome}
              style={{ background: getMenuTheme().background }}>
              {!isDualMenu && <NovaLogo className="logo" />}
              <p
                className={cn({ 'is-dual-menu-name': isDualMenu })}
                style={{
                  color: getMenuTheme().systemNameColor,
                  opacity: !menuOpen ? 0 : 1,
                }}>
                {AppConfig.systemInfo.name}
              </p>
              <Menu
                theme="light"
                mode="vertical"
                inlineCollapsed={!menuOpen}
                color={getMenuTheme().textColor}
                items={menuItems}
                selectedKeys={[routerPath]}
              />
            </div>
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
