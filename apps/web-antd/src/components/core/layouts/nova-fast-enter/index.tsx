import { Popover } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { useFastEnter } from '@/hooks/core/useFastEnter';
import { useSettingStore } from '@/store';
import type { FastEnterApplication, FastEnterQuickLink } from '@/types/config';

export function NovaFastEnter({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { getCustomRadius } = useSettingStore();

  // 使用快速入口配置
  const { enabledApplications, enabledQuickLinks } = useFastEnter();

  /**
   * 处理导航跳转
   * @param routeName 路由名称
   * @param link 外部链接
   */
  const handleNavigate = (routeName?: string, link?: string): void => {
    const targetPath = routeName || link;

    if (!targetPath) {
      console.warn('导航配置无效：缺少路由名称或链接');
      return;
    }

    if (targetPath.startsWith('http')) {
      window.open(targetPath, '_blank');
    } else {
      navigate(targetPath);
    }

    setOpen(false);
  };

  /**
   * 处理应用项点击
   * @param application 应用配置对象
   */
  const handleApplicationClick = (application: FastEnterApplication): void => {
    handleNavigate(application.routeName, application.link);
  };

  /**
   * 处理快速链接点击
   * @param quickLink 快速链接配置对象
   */
  const handleQuickLinkClick = (quickLink: FastEnterQuickLink): void => {
    handleNavigate(quickLink.routeName, quickLink.link);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const content = (
    <div className="grid w-[700px] grid-cols-[2fr_0.8fr] gap-4">
      <div>
        <div className="grid grid-cols-2 gap-1.5">
          {enabledApplications.map((application) => (
            <div
              key={application.name}
              className="mr-3 flex cursor-pointer items-center justify-center gap-3 rounded-lg p-2 hover:bg-gray-200/70 hover:[&_.app-icon]:!bg-transparent dark:hover:bg-gray-200/90"
              onClick={() => handleApplicationClick(application)}>
              <div className="app-icon flex size-12 items-center justify-center rounded-lg bg-gray-200/80 dark:bg-gray-300/30">
                <NovaSvgIcon
                  className="text-xl"
                  icon={application.icon}
                  style={{ color: application.iconColor }}
                />
              </div>
              <div>
                <h3 className="m-0 text-sm font-medium text-gray-800">{application.name}</h3>
                <p className="mt-1 text-xs text-gray-600">{application.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-l border-[var(--default-border)] pl-6 pt-2">
        <h3 className="mb-2.5 text-base font-medium text-gray-800">快速链接</h3>
        <ul>
          {enabledQuickLinks.map((quickLink) => (
            <li
              key={quickLink.name}
              className="cursor-pointer py-2 hover:[&_span]:text-theme"
              onClick={() => handleQuickLinkClick(quickLink)}>
              <span className="text-gray-600 no-underline">{quickLink.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="hover"
      placement="bottomLeft"
      open={open}
      onOpenChange={handleOpenChange}
      classNames={{
        root: 'fast-enter-popover',
      }}
      styles={{
        container: {
          border: '1px solid var(--default-border)',
          borderRadius: `calc(${getCustomRadius()} / 2 + 4px)`,
        },
      }}>
      <div className="flex items-center justify-center gap-2">{children}</div>
    </Popover>
  );
}
