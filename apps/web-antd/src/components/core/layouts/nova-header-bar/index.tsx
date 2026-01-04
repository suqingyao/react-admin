import { cn } from '@suqingyao/utils';
import { useFullscreen } from 'ahooks';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { type LanguageEnum, MenuTypeEnum } from '@/enums/appEnum';
import { useCommon } from '@/hooks/core/useCommon';
import { useHeaderBar } from '@/hooks/core/useHeaderBar';
import { useWindowSize } from '@/hooks/shared';
import eventEmitter from '@/lib/sys/event-emitter';
import { useMenuStore, useSettingStore, useUserStore } from '@/store';
import { NovaLogo } from '../../base/nova-logo';
import { NovaIconButton } from '../../widget/nova-icon-button';
import { NovaBreadcrumb } from '../nova-breadcrumb';
import { NovaFastEnter } from '../nova-fast-enter';
import { NovaHorizontalMenu } from '../nova-menus/nova-horizontal-menu';
import { NovaMixedMenu } from '../nova-menus/nova-mixed-menu';
import { NovaUserMenu } from './widget/NovaUserMenu';

export function NovaHeaderBar() {
  // TODO i18n

  const { homePath, refresh } = useCommon();

  const navigate = useNavigate();

  const { width } = useWindowSize();
  const {
    menuOpen,
    systemThemeColor,
    showSettingGuide,
    menuType,
    isDark,
    tabStyle,
    hideSettingGuide,
    setMenuOpen,
  } = useSettingStore();
  const { info, language, setLanguage } = useUserStore();
  const { menuList } = useMenuStore();

  const {
    shouldShowMenuButton,
    shouldShowRefreshButton,
    shouldShowFastEnter,
    shouldShowBreadcrumb,
    shouldShowGlobalSearch,
    shouldShowFullscreen,
    shouldShowNotification,
    shouldShowChat,
    shouldShowLanguage,
    shouldShowSettings,
    shouldShowThemeToggle,
    fastEnterMinWidth: headerBarFastEnterMinWidth,
  } = useHeaderBar();

  const isLeftMenu = useMemo(() => menuType === MenuTypeEnum.LEFT, [menuType]);
  const isDualMenu = useMemo(() => menuType === MenuTypeEnum.DUAL_MENU, [menuType]);
  const isTopMenu = useMemo(() => menuType === MenuTypeEnum.TOP, [menuType]);
  const isTopLeftMenu = useMemo(() => menuType === MenuTypeEnum.TOP_LEFT, [menuType]);

  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen, isEnabled }] =
    useFullscreen(window.document.body);

  const [showNotice, setShowNotice] = useState(false);

  /**
   * 切换菜单显示/隐藏状态
   */
  const visibleMenu = (): void => {
    setMenuOpen(!menuOpen);
  };

  const toHome = () => {
    navigate(homePath);
  };

  /**
   * 刷新页面
   * @param {number} time - 延迟时间，默认为0毫秒
   */
  const reload = (time: number = 0): void => {
    setTimeout(() => {
      refresh();
    }, time);
  };

  /**
   * 初始化语言设置
   */
  const initLanguage = (): void => {
    // locale = language
  };

  /**
   * 切换系统语言
   * @param {LanguageEnum} lang - 目标语言类型
   */
  const changeLanguage = (lang: LanguageEnum): void => {
    if (language === lang) return;
    setLanguage(lang);
    reload(50);
  };

  /**
   * 打开设置面板
   */
  const openSetting = (): void => {
    eventEmitter.emit('openSetting');

    // 隐藏设置引导提示
    if (showSettingGuide) {
      hideSettingGuide();
    }
  };

  /**
   * 打开全局搜索对话框
   */
  const openSearchDialog = (): void => {
    eventEmitter.emit('openSearchDialog');
  };

  /**
   * 点击页面其他区域关闭通知面板
   * @param {Event} e - 点击事件对象
   */
  const bodyCloseNotice = (e: any): void => {
    if (!showNotice) return;

    const target = e.target as HTMLElement;

    // 检查是否点击了通知按钮或通知面板内部
    const isNoticeButton = target.closest('.notice-button');
    const isNoticePanel = target.closest('.nova-notification-panel');

    if (!isNoticeButton && !isNoticePanel) {
      setShowNotice(false);
    }
  };

  /**
   * 切换通知面板显示状态
   */
  const visibleNotice = (): void => {
    setShowNotice(!showNotice);
  };

  /**
   * 打开聊天窗口
   */
  const openChat = (): void => {
    eventEmitter.emit('openChat');
  };

  return (
    <div
      className={cn(
        'w-full bg-[var(--default-color)]',
        (tabStyle === 'tab-card' || tabStyle === 'tab-google') &&
          'mb-5 max-sm:mb-3 !bg-[var(--default-box-color)]',
      )}>
      <div
        className={cn(
          'relative box-border flex justify-between h-15 leading-15 select-none',
          (tabStyle === 'tab-card' || tabStyle === 'tab-google') &&
            'border-b border-[var(--nova-card-border)]',
        )}>
        <div className="flex items-center flex-1 min-w-0 leading-15" style={{ display: 'flex' }}>
          {/* 系统信息 */}
          {isTopMenu && (
            <div className="flex items-center cursor-pointer" onClick={toHome}>
              <NovaLogo
                className="!hidden pl-3.5 overflow-hidden align-[0.15em] fill-current"
                onClick={toHome}
              />
            </div>
          )}

          <NovaLogo
            className="!hidden pl-3.5 overflow-hidden align-[-0.15em] fill-current"
            onClick={toHome}
          />

          {/* 菜单按钮 */}
          {isLeftMenu && shouldShowMenuButton && (
            <NovaIconButton
              icon="ri:menu-2-fill"
              className="ml-3 max-sm:ml-[7px]"
              onClick={visibleMenu}
            />
          )}
          {/* 刷新按钮 */}
          {shouldShowRefreshButton && (
            <NovaIconButton
              icon="ri:refresh-line"
              className="!ml-3 refresh-btn max-sm:!hidden"
              style={{ marginLeft: !isLeftMenu ? '10px' : '0' }}
              onClick={reload}
            />
          )}
          {/* 快速入口 */}
          {shouldShowFastEnter && width >= headerBarFastEnterMinWidth && (
            <NovaFastEnter>
              <NovaIconButton icon="ri:function-line" className="ml-3" />
            </NovaFastEnter>
          )}
          {/* 面包屑 */}
          {((shouldShowBreadcrumb && isLeftMenu) || (shouldShowBreadcrumb && isDualMenu)) && (
            <NovaBreadcrumb />
          )}

          {/* 顶部菜单 */}
          {isTopMenu && <NovaHorizontalMenu list={menuList} />}

          {/* 混合菜单 */}
          {isTopLeftMenu && <NovaMixedMenu list={menuList} />}
        </div>
      </div>
    </div>
  );
}
