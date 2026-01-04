import { cn } from '@suqingyao/utils';
import { useMemo } from 'react';
import type { RouteObject } from 'react-router';
import { matchRoutes, useLocation, useNavigate } from 'react-router';
import { routes } from '@/router/routes';
import type { AppRouteRecord } from '@/types';

export interface BreadcrumbItem {
  path: string;
  meta: AppRouteRecord['meta'];
}

function isHomeRoute(route: AppRouteRecord): boolean {
  return route.path === '/';
}

export function NovaBreadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const matched = matchRoutes(routes as unknown as RouteObject[], location);

    if (!matched) return [];

    const matchedLength = matched.length;

    if (!matchedLength || isHomeRoute(matched[0].route as AppRouteRecord)) {
      return [];
    }

    // 处理一级菜单和普通路由
    const firstRoute = matched[0].route as AppRouteRecord;
    const isFirstLevel = firstRoute.meta?.isFirstLevel;
    const lastIndex = matchedLength - 1;
    const currentRoute = matched[lastIndex].route as AppRouteRecord;
    const currentRouteMeta = currentRoute.meta;

    let items = isFirstLevel
      ? [createBreadcrumbItem(currentRoute)]
      : matched.map((match) => createBreadcrumbItem(match.route as AppRouteRecord));

    // 过滤包裹容器：如果有多个项目且第一个是容器路由（如 /outside），则移除它
    if (items.length > 1 && isWrapperContainer(items[0])) {
      items = items.slice(1);
    }

    // IFrame 页面特殊处理：如果过滤后只剩一个 iframe 页面，或者所有项都是包裹容器，则仅展示当前页
    if (currentRouteMeta?.isIframe && (items.length === 1 || items.every(isWrapperContainer))) {
      return [createBreadcrumbItem(currentRoute)];
    }

    // 过滤掉 meta.title 为空的路由
    return items.filter((item) => item.meta?.title);
  }, [location]);

  // 辅助函数：判断是否为包裹容器路由
  const isWrapperContainer = (item: BreadcrumbItem): boolean =>
    item.path === '/outside' && !!item.meta?.isIframe;

  const createBreadcrumbItem = (route: AppRouteRecord): BreadcrumbItem => ({
    path: route.path!,
    meta: route.meta,
  });

  // 辅助函数：判断是否为最后一项
  const isLastItem = (index: number): boolean => {
    const itemsLength = breadcrumbItems.length;
    return index === itemsLength - 1;
  };

  // 辅助函数：判断是否可点击
  const isClickable = (item: BreadcrumbItem, index: number): boolean =>
    item.path !== '/outside' && !isLastItem(index) && !item.meta?.isIframe;

  // 辅助函数：查找路由的第一个有效子路由
  const findFirstValidChild = (routeChildren: AppRouteRecord[]) =>
    routeChildren?.find((child) => !child.meta?.isHide);

  // 辅助函数：构建完整路径
  const buildFullPath = (childPath: string): string => `/${childPath}`.replace('//', '/');
  // 处理面包屑点击事件
  const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
    // 如果是最后一项或外部链接，不处理
    if (isLastItem(index) || item.path === '/outside') {
      return;
    }

    const matched = matchRoutes(routes as unknown as RouteObject[], item.path);
    const targetRoute = matched?.[matched.length - 1]?.route as AppRouteRecord;

    if (!targetRoute?.children?.length) {
      navigate(item.path);
      return;
    }

    const firstValidChild = findFirstValidChild(targetRoute.children);

    if (firstValidChild?.path) {
      const childPath = firstValidChild.path;
      if (childPath.startsWith('/')) {
        navigate(childPath);
      } else {
        const parentPath = item.path.endsWith('/') ? item.path : `${item.path}/`;
        navigate(`${parentPath}${childPath}`);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="ml-2.5 max-lg:!hidden" aria-label="breadcrumb">
      <ul className="flex items-center justify-center h-full">
        {breadcrumbItems.map((item, index) => (
          <li
            key={item.path}
            className="box-border flex  items-center justify-center h-7 text-sm leading-7">
            <div
              className={cn(
                isClickable(item, index) &&
                  'cursor-pointer py-1 rounded transition duration-200 hover:bg-active-color hover:[&_span]:text-gray-600',
              )}
              onClick={() => handleBreadcrumbClick(item, index)}>
              <span className="block max-w-46 overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-sm text-gray-600 dark:text-gray-800">
                {item.meta.title}
              </span>
            </div>
            {!isLastItem(index) && item.meta?.title && (
              <div className="mx-1 text-sm not-italic text-gray-500" aria-hidden="true">
                /
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
