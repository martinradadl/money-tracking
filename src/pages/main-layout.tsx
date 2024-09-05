import React from "react";
import { NavBar } from "../components/nav-bar/nav-bar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-dvh bg-navy">
      {children}
      <NavBar />
    </div>
  );
};
