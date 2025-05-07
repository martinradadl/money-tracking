import { Outlet } from "react-router-dom";
import { AuthWrapper } from "./auth-wrapper";

export const NonAuthLayout = () => {
  return (
    <AuthWrapper isNonAuthRoute>
      <div className="flex flex-col h-dvh bg-navy">
        <Outlet />
      </div>
    </AuthWrapper>
  );
};
