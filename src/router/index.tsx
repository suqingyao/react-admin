import type { RouteObject } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { DefaultLayout } from '@/layouts';
import NotFound from '@/pages/exceptions/not-found';
import HomePage from '@/pages/home/page';

const modules = import.meta.glob('./modules/**/*.tsx');

const routes: RouteObject[] = [];

Object.values(modules).forEach((module) => {
  module().then((mod: any) => {
    routes.push(...(mod.default as RouteObject[]));
  });
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: <HomePage />,
      },
    ],
  },
  ...routes,
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function RouterView() {
  return <RouterProvider router={router} />;
}
