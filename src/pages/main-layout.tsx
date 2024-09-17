import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
      <NavBar />
    </div>
  );
};
