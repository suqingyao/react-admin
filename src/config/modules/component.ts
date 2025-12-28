/**
 * 全局组件配置
 *
 * 统一管理系统级全局组件的注册。
 * 这些组件会在应用启动时全局注册，可在任何地方使用。
 *
 * ## 主要功能
 *
 * - 组件配置 - 集中管理全局组件的配置信息
 * - 异步加载 - 使用 React.lazy 实现按需加载
 * - 开关控制 - 支持通过 enabled 字段启用/禁用组件
 * - 配置查询 - 提供工具函数快速查询组件配置
 *
 * @module config/component
 * @author Art Design Pro Team
 */

import { type JSX, lazy } from 'react';

/**
 * 全局组件配置接口
 */
export interface GlobalComponentConfig {
  /** 组件名称 */
  name: string;
  /** 组件标识 */
  key: string;
  /** 组件 */
  component: React.LazyExoticComponent<() => JSX.Element>;
  /** 是否启用 */
  enabled?: boolean;
  /** 组件描述 */
  description?: string;
}

/**
 * 全局组件配置列表
 */
export const globalComponentsConfig: GlobalComponentConfig[] = [
  {
    name: '设置面板',
    key: 'settings-panel',
    component: lazy(async () => {
      const module = await import('@/components/core/layouts/nova-settings-panel');
      return { default: module.NovaSettingsPanel };
    }),
    enabled: true,
  },
  {
    name: '全局搜索',
    key: 'global-search',
    component: lazy(async () => {
      const module = await import('@/components/core/layouts/nova-global-search');
      return { default: module.NovaGlobalSearch };
    }),
    enabled: true,
  },
  // {
  //   name: '锁屏',
  //   key: 'screen-lock',
  //   component: lazy(() => import('@/components/core/layouts/nova-screen-lock/index.tsx')),
  //   enabled: true,
  // },
  // {
  //   name: '聊天窗口',
  //   key: 'chat-window',
  //   component: lazy(() => import('@/components/core/layouts/nova-chat-window/index.tsx')),
  //   enabled: true,
  // },
  // {
  //   name: '礼花效果',
  //   key: 'fireworks-effect',
  //   component: lazy(() => import('@/components/core/layouts/nova-fireworks-effect/index.tsx')),
  //   enabled: true,
  // },
  // {
  //   name: '水印效果',
  //   key: 'watermark',
  //   component: lazy(() => import('@/components/core/others/nova-watermark/index.tsx')),
  //   enabled: true,
  // },
];

/**
 * 获取启用的全局组件
 * @returns 已启用的组件配置列表
 */
export const getEnabledGlobalComponents = () => {
  return globalComponentsConfig.filter((config) => config.enabled !== false);
};

/**
 * 根据 key 获取组件配置
 * @param key 组件标识
 * @returns 组件配置对象
 */
export const getGlobalComponentByKey = (key: string) => {
  return globalComponentsConfig.find((config) => config.key === key);
};
