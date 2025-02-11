import { NavBar } from "../components/nav-bar/nav-bar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUser, getCurrencies, useAuth } from "../data/authentication";
import { getCategories } from "../data/categories";
import { user as userCookie } from "../helpers/cookies";

export const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrencies();
    getCategories();
  }, []);

  useEffect(() => {
    if (!user && !userCookie()) {
      console.log("first useEffect", user);
      navigate(`/login`);
    }
  }, [user]);

  useEffect(() => {
    const userCookieValue = userCookie();
    setUser(userCookieValue);
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-navy">
      <Outlet />
      <NavBar />
    </div>
  );
};
