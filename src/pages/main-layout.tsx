import { useCookies } from "react-cookie";
import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userState } from "../data/authentication";
import { useRecoilState } from "recoil";

export const MainLayout = () => {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();
  const [, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!cookies.user) {
      navigate(`/login`);
    } else {
      setUser(cookies.user);
    }
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
      <NavBar />
    </div>
  );
};
