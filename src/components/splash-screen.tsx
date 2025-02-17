import { useEffect } from "react";
import {
  getCurrencies,
  logout,
  setIsSplashScreenLoading,
  setUser,
} from "../data/authentication";
import { getCategories } from "../data/categories";
import { user } from "../helpers/cookies";
import { isExpired } from "../helpers/utils";

export const SplashScreen = () => {
  useEffect(() => {
    Promise.all([getCurrencies(), getCategories()]).then(() => {
      const userCookieValue = user();
      if (userCookieValue) {
        setUser(userCookieValue);
      }
      setTimeout(() => {
        setIsSplashScreenLoading(false);
      }, 1000);
    });
  }, []);

  useEffect(() => {
    if (isExpired()) {
      logout();
      setIsSplashScreenLoading(false);
    }
  }, []);

  return (
    <div className="bg-green text-navy">
      <h1>Loading</h1>
    </div>
  );
};
