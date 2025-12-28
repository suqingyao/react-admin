import { Modal, Popover } from 'antd';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { WEB_LINKS } from '@/lib/constants/links';
import eventEmitter from '@/lib/sys/event-emitter';
import { useUserStore } from '@/store';

export function NovaUserMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { info, logOut } = useUserStore();

  const userName = useMemo<string>(() => info?.userName || 'Admin', [info?.userName]);
  const userEmail = useMemo<string>(() => info?.email || 'admin@example.com', [info?.email]);
  const avatarText = useMemo<string>(() => (userName || 'A').charAt(0).toUpperCase(), [userName]);

  const handleMenuClick = useCallback(
    (key: 'user-center' | 'docs' | 'github' | 'lock-screen' | 'logout') => {
      if (key === 'user-center') {
        navigate('/users');
        return;
      }

      if (key === 'docs') {
        window.open(WEB_LINKS.DOCS, '_blank');
        return;
      }

      if (key === 'github') {
        window.open(WEB_LINKS.GITHUB, '_blank');
        return;
      }

      if (key === 'lock-screen') {
        (eventEmitter as unknown as { emit: (event: string, payload?: unknown) => void }).emit(
          'openLockScreen',
        );
        return;
      }

      if (key === 'logout') {
        Modal.confirm({
          title: '提示',
          content: '确定要退出登录吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            // 使用 Store 的登出逻辑，统一处理状态与路由
            // Use store logout logic to unify state & navigation
            logOut(
              navigate as unknown as (path: string, options?: unknown) => void,
              location.pathname,
            );
          },
        });
      }
    },
    [location.pathname, logOut, navigate],
  );

  return (
    <Popover
      placement="bottomRight"
      trigger="hover"
      content={
        <div className="pt-3">
          <div className="flex items-center pb-1 px-0">
            <div className="w-10 h-10 mr-3 ml-0 overflow-hidden rounded-full bg-blue-500 text-white flex items-center justify-center">
              {avatarText}
            </div>
            <div className="w-[calc(100%-60px)] h-full">
              <span className="block text-sm font-medium text-g-800 truncate">{userName}</span>
              <span className="block mt-0.5 text-xs text-g-500 truncate">{userEmail}</span>
            </div>
          </div>
          <ul className="py-4 mt-3 border-t border-g-300/80">
            <li
              className="btn-item flex items-center gap-2"
              onClick={() => handleMenuClick('user-center')}>
              <NovaSvgIcon icon="ri:user-3-line" />
              <span>个人中心</span>
            </li>
            <li
              className="btn-item flex items-center gap-2"
              onClick={() => handleMenuClick('docs')}>
              <NovaSvgIcon icon="ri:book-2-line" />
              <span>使用文档</span>
            </li>
            <li
              className="btn-item flex items-center gap-2"
              onClick={() => handleMenuClick('github')}>
              <NovaSvgIcon icon="ri:github-line" />
              <span>GitHub</span>
            </li>
            <li
              className="btn-item flex items-center gap-2"
              onClick={() => handleMenuClick('lock-screen')}>
              <NovaSvgIcon icon="ri:lock-line" />
              <span>锁屏</span>
            </li>
            <div className="w-full h-px my-2 bg-g-300/80" />
            <div className="log-out c-p" onClick={() => handleMenuClick('logout')}>
              退出登录
            </div>
          </ul>
        </div>
      }>
      <div className="size-8.5 mr-5 cursor-pointer rounded-full bg-blue-500 text-white flex items-center justify-center max-sm:w-6.5 max-sm:h-6.5 max-sm:mr-[16px]">
        {avatarText}
      </div>
    </Popover>
  );
}
