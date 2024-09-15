import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Documents from './views/Documents';
import Settings from './views/Settings';
import NotFound from './views/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;