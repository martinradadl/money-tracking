import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./dashboard";
import { Transactions } from "./transactions";
import { Debts } from "./debts";
import { PageNotFound } from "./page-not-found";
import { Profile } from "./profile";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
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
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
