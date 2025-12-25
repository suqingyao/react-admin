import { create } from 'zustand';
import AppConfig from '@/config';
import { SETTING_DEFAULT_CONFIG } from '@/config/setting';
import type { ContainerWidthEnum, MenuTypeEnum, SystemThemeEnum } from '@/enums/appEnum';
import { MenuThemeEnum } from '@/enums/appEnum';
import type { MenuThemeType } from '@/types';

export interface SettingStore {
  /** 菜单类型 */
  menuType: MenuTypeEnum;
  /** 菜单展开宽度 */
  menuOpenWidth: number;
  /** 菜单是否展开 */
  menuOpen: boolean;
  /** 双菜单是否显示文本 */
  dualMenuShowText: boolean;

  /** 系统主题类型 */
  systemThemeType: SystemThemeEnum;
  /** 系统主题模式 */
  systemThemeMode: SystemThemeEnum;
  /** 菜单主题类型 */
  menuThemeType: MenuThemeEnum;
  /** 系统主题颜色 */
  systemThemeColor: (typeof AppConfig)['systemMainColor'][number];

  /** 是否显示菜单按钮 */
  showMenuButton: boolean;
  /** 是否显示快速进入按钮 */
  showFastEnter: boolean;
  /** 是否显示刷新按钮 */
  showRefreshButton: boolean;
  /** 是否显示面包屑 */
  showCrumbs: boolean;
  /** 是否显示工作标签页 */
  showWorkTab: boolean;
  /** 是否显示语言切换 */
  showLanguage: boolean;
  /** 是否显示进度条 */
  showNprogress: boolean;
  /** 是否显示设置引导 */
  showSettingGuide: boolean;
  /** 是否显示节日文本 */
  showFestivalText: boolean;
  /** 是否显示水印 */
  watermarkVisible: boolean;

  /** 是否自动关闭 */
  autoClose: boolean;
  /** 是否唯一展开 */
  uniqueOpened: boolean;
  /** 是否色弱模式 */
  colorWeak: boolean;
  /** 是否刷新 */
  refresh: boolean;
  /** 是否加载节日烟花 */
  holidayFireworksLoaded: boolean;

  /** 边框模式 */
  boxBorderMode: boolean;
  /** 页面过渡效果 */
  pageTransition: string;
  /** 标签页样式 */
  tabStyle: string;
  /** 自定义圆角 */
  customRadius: string;
  /** 容器宽度 */
  containerWidth: string;
  /** 节日日期 */
  festivalDate: string;

  /**
   * 获取菜单主题
   * 根据当前主题类型和暗色模式返回对应的主题配置
   */
  getMenuTheme: () => MenuThemeType;

  /**
   * 判断是否为暗色模式
   */
  isDark: () => boolean;

  /**
   * 获取菜单展开宽度
   */
  getMenuOpenWidth: () => string;

  /**
   * 获取自定义圆角
   */
  getCustomRadius: () => string;

  /**
   * 是否显示烟花
   * 根据当前日期和节日日期判断是否显示烟花效果
   */
  isShowFireworks: () => boolean;

  /**
   * 切换菜单布局
   * @param type 菜单类型
   */
  switchMenuLayout: (type: MenuTypeEnum) => void;

  /**
   * 设置菜单展开宽度
   * @param width 宽度值
   */
  setMenuOpenWidth: (width: number) => void;

  /**
   * 设置全局主题
   * @param theme 主题类型
   * @param themeMode 主题模式
   */
  setGlobalTheme: (theme: SystemThemeEnum, themeMode: SystemThemeEnum) => void;

  /**
   * 切换菜单样式
   * @param theme 菜单主题
   */
  switchMenuStyles: (theme: MenuThemeEnum) => void;

  /**
   * 设置Antd主题颜色
   * @param theme 主题颜色
   */
  setAntdThemeColor: (theme: SystemThemeEnum) => void;

  /**
   * 切换边框模式
   */
  setBorderMode: () => void;

  /**
   * 设置容器宽度
   * @param width 容器宽度枚举值
   */
  setContainerWidth: (width: ContainerWidthEnum) => void;

  /**
   * 切换唯一展开模式
   */
  setUniqueOpened: () => void;

  /**
   * 切换菜单按钮显示
   */
  setButton: () => void;

  /**
   * 切换快速进入按钮显示
   */
  setFastEnter: () => void;

  /**
   * 切换自动关闭
   */
  setAutoClose: () => void;

  /**
   * 切换刷新按钮显示
   */
  setShowRefreshButton: () => void;

  /**
   * 切换面包屑显示
   */
  setCrumbs: () => void;

  /**
   * 设置工作台标签显示
   * @param show 是否显示
   */
  setWorkTab: (show: boolean) => void;

  /**
   * 切换语言切换显示
   */
  setLanguage: () => void;

  /**
   * 切换进度条显示
   */
  setNprogress: () => void;

  /**
   * 切换色弱模式
   */
  setColorWeak: () => void;

  /**
   * 隐藏设置引导
   */
  hideSettingGuide: () => void;

  /**
   * 显示设置引导
   */
  openSettingGuide: () => void;

  /**
   * 设置页面过渡效果
   * @param transition 过渡效果名称
   */
  setPageTransition: (transition: string) => void;

  /**
   * 设置标签页样式
   * @param style 样式名称
   */
  setTabStyle: (style: string) => void;

  /**
   * 设置菜单展开状态
   * @param open 是否展开
   */
  setMenuOpen: (open: boolean) => void;

  /**
   * 刷新页面
   */
  reload: () => void;

  /**
   * 设置水印显示
   * @param visible 是否显示
   */
  setWatermarkVisible: (visible: boolean) => void;

  /**
   * 设置自定义圆角
   * @param radius 圆角值
   */
  setCustomRadius: (radius: string) => void;

  /**
   * 设置节日烟花加载状态
   * @param isLoad 是否已加载
   */
  setHolidayFireworksLoaded: (isLoad: boolean) => void;

  /**
   * 设置节日文本显示
   * @param show 是否显示
   */
  setShowFestivalText: (show: boolean) => void;

  /**
   * 设置节日日期
   * @param date 日期字符串
   */
  setFestivalDate: (date: string) => void;

  /**
   * 设置双菜单是否显示文本
   * @param show 是否显示
   */
  setDualMenuShowText: (show: boolean) => void;
}

export const useSettingStore = create<SettingStore>((set, get) => ({
  menuType: SETTING_DEFAULT_CONFIG.menuType,
  menuOpenWidth: SETTING_DEFAULT_CONFIG.menuOpenWidth,
  menuOpen: SETTING_DEFAULT_CONFIG.menuOpen,
  dualMenuShowText: SETTING_DEFAULT_CONFIG.dualMenuShowText,

  systemThemeType: SETTING_DEFAULT_CONFIG.systemThemeType,
  systemThemeMode: SETTING_DEFAULT_CONFIG.systemThemeMode,
  menuThemeType: SETTING_DEFAULT_CONFIG.menuThemeType,
  systemThemeColor: SETTING_DEFAULT_CONFIG.systemThemeColor,

  showMenuButton: SETTING_DEFAULT_CONFIG.showMenuButton,
  showFastEnter: SETTING_DEFAULT_CONFIG.showFastEnter,
  showRefreshButton: SETTING_DEFAULT_CONFIG.showRefreshButton,
  showCrumbs: SETTING_DEFAULT_CONFIG.showCrumbs,
  showWorkTab: SETTING_DEFAULT_CONFIG.showWorkTab,
  showLanguage: SETTING_DEFAULT_CONFIG.showLanguage,
  showNprogress: SETTING_DEFAULT_CONFIG.showNprogress,
  showSettingGuide: SETTING_DEFAULT_CONFIG.showSettingGuide,
  showFestivalText: SETTING_DEFAULT_CONFIG.showFestivalText,
  watermarkVisible: SETTING_DEFAULT_CONFIG.watermarkVisible,

  autoClose: SETTING_DEFAULT_CONFIG.autoClose,
  uniqueOpened: SETTING_DEFAULT_CONFIG.uniqueOpened,
  colorWeak: SETTING_DEFAULT_CONFIG.colorWeak,
  refresh: SETTING_DEFAULT_CONFIG.refresh,
  holidayFireworksLoaded: SETTING_DEFAULT_CONFIG.holidayFireworksLoaded,

  boxBorderMode: SETTING_DEFAULT_CONFIG.boxBorderMode,
  pageTransition: SETTING_DEFAULT_CONFIG.pageTransition,
  tabStyle: SETTING_DEFAULT_CONFIG.tabStyle,
  customRadius: SETTING_DEFAULT_CONFIG.customRadius,
  containerWidth: SETTING_DEFAULT_CONFIG.containerWidth,

  festivalDate: SETTING_DEFAULT_CONFIG.festivalDate,

  getMenuTheme: () => {
    const dark = get().isDark();
    if (dark && AppConfig.darkMenuStyles && AppConfig.darkMenuStyles.length)
      return AppConfig.darkMenuStyles[0] as MenuThemeType;
    const theme = AppConfig.themeList.find((item) => item.theme === get().menuThemeType);
    return (theme || AppConfig.themeList[0]) as MenuThemeType;
  },
  isDark: () => get().menuThemeType === MenuThemeEnum.DARK,
  getMenuOpenWidth: () => `${get().menuOpenWidth || SETTING_DEFAULT_CONFIG.menuOpenWidth}px`,
  getCustomRadius: () => `${get().customRadius || SETTING_DEFAULT_CONFIG.customRadius}rem`,
  isShowFireworks: () => get().holidayFireworksLoaded,
  switchMenuLayout: (type: MenuTypeEnum) => set({ menuType: type }),
  setMenuOpenWidth: (width: number) => set({ menuOpenWidth: width }),
  setGlobalTheme: (theme: SystemThemeEnum, themeMode: SystemThemeEnum) =>
    set({ systemThemeType: theme, systemThemeMode: themeMode }),
  switchMenuStyles: (theme: MenuThemeEnum) => set({ menuThemeType: theme }),
  setAntdThemeColor: (_theme: SystemThemeEnum) => {
    /* no-op placeholder for antd theme integration */
  },
  setBorderMode: () => set((state) => ({ boxBorderMode: !state.boxBorderMode })),
  setContainerWidth: (width: ContainerWidthEnum) =>
    set({ containerWidth: width as unknown as string }),
  setUniqueOpened: () => set((state) => ({ uniqueOpened: !state.uniqueOpened })),
  setButton: () => set((state) => ({ showMenuButton: !state.showMenuButton })),
  setFastEnter: () => set((state) => ({ showFastEnter: !state.showFastEnter })),
  setAutoClose: () => set((state) => ({ autoClose: !state.autoClose })),
  setShowRefreshButton: () => set((state) => ({ showRefreshButton: !state.showRefreshButton })),
  setCrumbs: () => set((state) => ({ showCrumbs: !state.showCrumbs })),
  setWorkTab: (show: boolean) => set({ showWorkTab: show }),
  setLanguage: () => set((state) => ({ showLanguage: !state.showLanguage })),
  setNprogress: () => set((state) => ({ showNprogress: !state.showNprogress })),
  setColorWeak: () => set((state) => ({ colorWeak: !state.colorWeak })),
  hideSettingGuide: () => set({ showSettingGuide: false }),
  openSettingGuide: () => set({ showSettingGuide: true }),
  setPageTransition: (transition: string) => set({ pageTransition: transition }),
  setTabStyle: (style: string) => set({ tabStyle: style }),
  setMenuOpen: (open: boolean) => set({ menuOpen: open }),
  reload: () => set((state) => ({ refresh: !state.refresh })),
  setWatermarkVisible: (visible: boolean) => set({ watermarkVisible: visible }),
  setCustomRadius: (radius: string) => {
    document.documentElement.style.setProperty('--custom-radius', `${radius}rem`);
    set({ customRadius: radius });
  },
  setHolidayFireworksLoaded: (isLoad: boolean) => set({ holidayFireworksLoaded: isLoad }),
  setShowFestivalText: (show: boolean) => set({ showFestivalText: show }),
  setFestivalDate: (date: string) => set({ festivalDate: date }),
  setDualMenuShowText: (show: boolean) => set({ dualMenuShowText: show }),
}));
