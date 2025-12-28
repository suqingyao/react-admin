import { cn } from '@suqingyao/utils';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation, useMatches } from 'react-router';
import { NovaFestivalTextScroll } from '@/components/core/text-effect/nova-festival-text-scroll';
import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight';
import { useSettingStore } from '@/store/modules/setting';
import type { AppRouteRecord } from '@/types';

export function NovaPageContent() {
  const matches = useMatches() as any[];
  const { containerMinHeight } = useAutoLayoutHeight();
  const { pageTransition, containerWidth, refresh } = useSettingStore();

  const [isRefresh, setIsRefresh] = useState(true);
  const [showTransitionMask, setShowTransitionMask] = useState(false);

  const isOpenRouteInfo = import.meta.env.VITE_OPEN_ROUTE_INFO === 'true';

  const isFullPage = useMemo(
    () =>
      matches.some((m) => {
        const route = m.route as AppRouteRecord | undefined;
        return Boolean(route?.meta?.isFullPage);
      }),
    [matches],
  );

  const containerStyle = useMemo<CSSProperties>(
    () =>
      isFullPage
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 2500,
            background: 'var(--default-bg-color)',
          }
        : {
            maxWidth: containerWidth,
          },
    [containerWidth, isFullPage],
  );

  const contentStyle = useMemo<CSSProperties>(
    () => ({
      minHeight: containerMinHeight,
    }),
    [containerMinHeight],
  );

  useEffect(() => {
    setIsRefresh(false);
    const id = window.requestAnimationFrame(() => {
      setIsRefresh(true);
    });
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, []);

  useEffect(() => {
    setShowTransitionMask(true);
    const timer = window.setTimeout(() => {
      setShowTransitionMask(false);
    }, 50);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const currentRoute = matches[matches.length - 1];
  const routeMeta = (currentRoute?.route as AppRouteRecord)?.meta;

  const location = useLocation();

  const pageKey = useMemo(
    () => `${location.pathname}${location.search}`,
    [location.pathname, location.search],
  );

  const pageTransitionClass = useMemo(
    () => (!showTransitionMask && pageTransition ? `page-transition-${pageTransition}` : ''),
    [pageTransition, showTransitionMask],
  );

  return (
    <>
      <div
        className={cn('layout-content', {
          'overflow-auto': isFullPage,
        })}
        style={containerStyle}>
        <div id="app-content-header">
          {!isFullPage && <NovaFestivalTextScroll />}

          {isOpenRouteInfo && routeMeta && (
            <div className="px-2 py-1.5 mb-3 text-sm text-gray-500 bg-gray-200 border-full-d rounded-md">
              <pre className="m-0 whitespace-pre-wrap break-all">
                router meta：{JSON.stringify(routeMeta, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div style={contentStyle}>
          {isRefresh && (
            <div key={pageKey} className={cn('art-page-view', pageTransitionClass)}>
              <Outlet />
            </div>
          )}
        </div>
      </div>

      {showTransitionMask &&
        createPortal(
          <div className="fixed left-0 top-0 z-[2000] h-screen w-screen bg-box" />,
          document.body,
        )}
    </>
  );
}
