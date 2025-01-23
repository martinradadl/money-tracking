import { useCookies } from "react-cookie";
import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUser, useAuth } from "../data/authentication";
import { useCategories } from "../data/categories";

export const MainLayout = () => {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();
  const { getCurrencies } = useAuth();
  const { getCategories } = useCategories();

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
