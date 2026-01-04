import type { RouteObject } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { HOME_PAGE_PATH } from './constants';
import { routes } from './routes';

const router = createBrowserRouter(routes as unknown as RouteObject[]);

export { HOME_PAGE_PATH, router, routes };
