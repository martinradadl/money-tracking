import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet } from "react-router-dom";
import { ExpirationModal } from "../components/expiration-modal";
import { AuthWrapper } from "./auth-wrapper";

export const MainLayout = () => {
  return (
    <AuthWrapper>
      <div className="flex flex-col h-dvh bg-navy">
        <Outlet />
        <NavBar />
        <ExpirationModal />
      </div>
    </AuthWrapper>
  );
};
