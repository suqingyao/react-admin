import { useMemo } from 'react';
import appConfig from '@/config';
import type { FastEnterApplication, FastEnterQuickLink } from '@/types/config';

export function useFastEnter() {
  // 获取快速入口配置
  const fastEnterConfig = appConfig.fastEnter;

  // 获取启用的应用列表（按排序权重排序）
  const enabledApplications = useMemo<FastEnterApplication[]>(() => {
    if (!fastEnterConfig?.applications) return [];

    return fastEnterConfig.applications
      .filter((app) => app.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [fastEnterConfig]);

  // 获取启用的快速链接（按排序权重排序）
  const enabledQuickLinks = useMemo<FastEnterQuickLink[]>(() => {
    if (!fastEnterConfig?.quickLinks) return [];

    return fastEnterConfig.quickLinks
      .filter((link) => link.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [fastEnterConfig]);

  // 获取最小显示宽度
  const minWidth = useMemo(() => {
    return fastEnterConfig?.minWidth || 1200;
  }, [fastEnterConfig]);

  return {
    fastEnterConfig,
    enabledApplications,
    enabledQuickLinks,
    minWidth,
  };
}
