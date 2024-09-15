import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Documents from './views/Documents';
import Settings from './views/Settings';
import Records from './views/Records';
import Converter from './views/Converter';
import NotFound from './views/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "records",
        element: <Records />
      },
      {
        path: "converter",
        element: <Converter />
      }
    ],
    errorElement: <NotFound />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;