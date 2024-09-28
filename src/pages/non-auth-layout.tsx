import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const NonAuthLayout = () => {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.user) {
      navigate(`/`);
    }
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
    </div>
  );
};
