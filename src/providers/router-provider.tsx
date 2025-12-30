import { createContext } from 'react';
import { RouterProvider as ReactRouterProvider } from 'react-router/dom';
import { router } from '@/router';

export const RouterContext = createContext({});

export const RouterProvider = () => {
  return (
    <RouterContext value={{}}>
      <ReactRouterProvider router={router} />
    </RouterContext>
  );
};
