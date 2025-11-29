import type { RouteObject } from 'react-router';

export type AppRoute = Omit<RouteObject, 'children' | 'index'> & {
  index?: false;
  children?: AppRoute[];
  meta?: {
    title: string;
    icon?: string;
    standalone?: boolean;
    cache?: boolean;
  };
};
