import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../data/authentication";
import { user as userCookie } from "../helpers/cookies";
import { ExpirationModal } from "../components/expiration-modal";
import { useShallow } from "zustand/shallow";
import { SplashScreen } from "../components/splash-screen";

export const MainLayout = () => {
  const { user, isSplashScreenLoading } = useAuth(
    useShallow((state) => ({
      user: state.user,
      isSplashScreenLoading: state.isSplashScreenLoading,
    }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !userCookie()) {
      navigate(`/login`);
    }
  }, [user]);

  if (isSplashScreenLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
      <NavBar />
      <ExpirationModal />
    </div>
  );
};
