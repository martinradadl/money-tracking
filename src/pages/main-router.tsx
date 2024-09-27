import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./dashboard";
import { Transactions } from "./transactions";
import { Debts } from "./debts";
import { PageNotFound } from "./page-not-found";
import { Profile } from "./profile";
import { MainLayout } from "./main-layout";
import { Login } from "./auth/login";
import { SignUp } from "./auth/sign-up";
import { NonAuthLayout } from "./non-auth-layout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "/", element: <Dashboard /> },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/debts",
        element: <Debts />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    Component: NonAuthLayout,
    children: [
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export const MainRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
