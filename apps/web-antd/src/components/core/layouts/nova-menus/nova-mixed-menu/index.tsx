import { useThrottleFn } from 'ahooks';
import type { WheelEvent as ReactWheelEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RouteObject } from 'react-router';
import { matchRoutes, useLocation } from 'react-router';
import { NovaSvgIcon } from '@/components/core/base/nova-svg-icon';
import { handleMenuJump } from '@/lib/navigation/jump';
import { formatMenuTitle } from '@/lib/router';
import { routes } from '@/router/routes';
import type { AppRouteRecord } from '@/types';

interface NovaMixedMenuProps {
  list: AppRouteRecord[];
}

interface ProcessedMenuItem extends AppRouteRecord {
  isActive: boolean;
  formattedTitle: string;
}

type ScrollDirection = 'left' | 'right';

const SCROLL_CONFIG = {
  BUTTON_SCROLL_DISTANCE: 200,
  WHEEL_FAST_STEP: 35,
  WHEEL_SLOW_STEP: 30,
  WHEEL_FAST_THRESHOLD: 100,
};

export function NovaMixedMenu(props: NovaMixedMenuProps) {
  const { list = [] } = props;
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();

  const matches = useMemo(
    () => matchRoutes(routes as unknown as RouteObject[], location),
    [location],
  );

  const currentActivePath = useMemo(() => {
    const currentRoute = matches?.[matches.length - 1]?.route as any;
    return String(currentRoute?.meta?.activePath || location.pathname);
  }, [matches, location.pathname]);

  const isMenuItemActive = (item: AppRouteRecord): boolean => {
    const activePath = currentActivePath;

    const checkNode = (node: AppRouteRecord): boolean => {
      if (node.path === activePath) {
        return true;
      }

      if (node.children?.length) {
        return node.children.some((child) => checkNode(child));
      }

      return false;
    };

    return checkNode(item);
  };

  const processedMenuList = useMemo<ProcessedMenuItem[]>(() => {
    return list.map((item) => ({
      ...item,
      isActive: isMenuItemActive(item),
      formattedTitle: formatMenuTitle(item.meta.title),
    }));
  }, [list]);

  const handleScrollCore = (): void => {
    const wrapper = scrollbarRef.current;

    if (!wrapper) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = wrapper;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
  };

  const { run: handleScroll } = useThrottleFn(handleScrollCore, {
    wait: 16,
  });

  const scroll = (direction: ScrollDirection): void => {
    const wrapper = scrollbarRef.current;

    if (!wrapper) {
      return;
    }

    const currentScroll = wrapper.scrollLeft;
    const targetScroll =
      direction === 'left'
        ? currentScroll - SCROLL_CONFIG.BUTTON_SCROLL_DISTANCE
        : currentScroll + SCROLL_CONFIG.BUTTON_SCROLL_DISTANCE;

    wrapper.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    const wrapper = scrollbarRef.current;

    if (!wrapper) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = wrapper;

    const scrollStep =
      Math.abs(event.deltaY) > SCROLL_CONFIG.WHEEL_FAST_THRESHOLD
        ? SCROLL_CONFIG.WHEEL_FAST_STEP
        : SCROLL_CONFIG.WHEEL_SLOW_STEP;

    const scrollDelta = event.deltaY > 0 ? scrollStep : -scrollStep;

    const targetScroll = Math.max(0, Math.min(scrollLeft + scrollDelta, scrollWidth - clientWidth));

    wrapper.scrollLeft = targetScroll;

    handleScrollCore();
  };

  const handleMenuClick = (item: AppRouteRecord): void => {
    handleMenuJump(item, true);
  };

  useEffect(() => {
    handleScrollCore();
  }, []);

  return (
    <div className="relative box-border flex w-full items-center overflow-hidden">
      {showLeftArrow && (
        <div className="button-arrow" onClick={() => scroll('left')}>
          <NovaSvgIcon icon="ri:arrow-left-line" />
        </div>
      )}

      <div
        ref={scrollbarRef}
        className="scrollbar-wrapper box-border flex h-15 flex-shrink-0 flex-nowrap items-center overflow-x-auto whitespace-nowrap"
        onScroll={() => handleScroll()}
        onWheel={handleWheel}>
        {processedMenuList.map((item) => {
          if (item.meta.isHide) {
            return null;
          }

          const isActive = item.isActive;
          const baseClass =
            'menu-item relative flex h-10 flex-shrink-0 items-center px-3 text-sm cursor-pointer hover:text-theme';
          const activeClass = isActive ? ' menu-item-active text-theme' : '';

          return (
            <div
              key={item.meta.title}
              className={`${baseClass}${activeClass}`}
              onClick={() => handleMenuClick(item)}>
              {item.meta.icon && (
                <NovaSvgIcon
                  icon={item.meta.icon}
                  className={`mr-1 text-lg text-g-700 dark:text-g-800${
                    isActive ? ' !text-theme' : ''
                  }`}
                />
              )}
              <span
                className={`text-md text-g-700 dark:text-g-800${isActive ? ' !text-theme' : ''}`}>
                {item.formattedTitle}
              </span>
              {item.meta.showBadge && <div className="art-badge art-badge-mixed" />}
            </div>
          );
        })}
      </div>

      {showRightArrow && (
        <div className="button-arrow right-2" onClick={() => scroll('right')}>
          <NovaSvgIcon icon="ri:arrow-right-line" />
        </div>
      )}
    </div>
  );
}
