import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/authentication";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { user as userCookie } from "../helpers/cookies";
import { SplashScreen } from "../components/splash-screen";

export const AuthWrapper = ({
  children,
  isNonAuthRoute,
}: {
  children: React.ReactNode;
  isNonAuthRoute?: boolean;
}) => {
  const navigate = useNavigate();
  const { user, isSplashScreenLoading } = useAuth(
    useShallow((state) => ({
      user: state.user,
      isSplashScreenLoading: state.isSplashScreenLoading,
    }))
  );
  useEffect(() => {
    if (isNonAuthRoute && userCookie()) {
      navigate(`/`);
    }
  }, []);

  useEffect(() => {
    if (!user && !userCookie()) {
      navigate(`/login`);
    }
  }, [user]);
  if (isSplashScreenLoading) {
    return <SplashScreen />;
  }
  return <>{children}</>;
};
