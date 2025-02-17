import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../data/authentication";
import { useShallow } from "zustand/shallow";
import { SplashScreen } from "../components/splash-screen";
import { useEffect } from "react";
import { user } from "../helpers/cookies";

export const NonAuthLayout = () => {
  const navigate = useNavigate();
  const { isSplashScreenLoading } = useAuth(
    useShallow((state) => ({
      isSplashScreenLoading: state.isSplashScreenLoading,
    }))
  );

  useEffect(() => {
    if (user()) {
      navigate(`/`);
    }
  }, []);

  if (isSplashScreenLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
    </div>
  );
};
