import { useCookies } from "react-cookie";
import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUser, getCurrencies } from "../data/authentication";
import { getCategories } from "../data/categories";

export const MainLayout = () => {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrencies();
    getCategories();
  }, []);

  useEffect(() => {
    if (!cookies.user) {
      navigate(`/login`);
    } else {
      setUser(cookies.user);
    }
  }, [cookies.user]);

  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
      <NavBar />
    </div>
  );
};
