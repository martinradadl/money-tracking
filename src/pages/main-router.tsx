import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./dashboard";
import { Transactions } from "./transactions";
import { Debts } from "./debts";
import { PageNotFound } from "./page-not-found";
import { Profile } from "./profile";
import { MainLayout } from "./main-layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },
  {
    path: "/transactions",
    element: (
      <MainLayout>
        <Transactions />
      </MainLayout>
    ),
  },
  {
    path: "/debts",
    element: (
      <MainLayout>
        <Debts />
      </MainLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <MainLayout>
        <Profile />
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <PageNotFound />
      </MainLayout>
    ),
  },
]);

export const MainRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
