import { useEffect, useState } from "react";
import {
  getCurrencies,
  getTimezones,
  logout,
  setIsSplashScreenLoading,
  setUser,
} from "../data/authentication";
import { getCategories } from "../data/categories";
import { user } from "../helpers/cookies";
import { isExpired } from "../helpers/utils";

export const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    Promise.all([getCurrencies(), getCategories(), getTimezones()]).then(() => {
      const min = 0.33;
      const max = 0.66;
      setProgress(Math.random() * (max - min) + min);

      const userCookieValue = user();
      if (userCookieValue) {
        setUser(userCookieValue);
      }

      setTimeout(() => {
        setProgress(1);
      }, 1000);
    });
  }, []);

  useEffect(() => {
    if (progress === 1) {
      setTimeout(() => {
        setIsSplashScreenLoading(false);
      }, 500);
    }
  }, [progress]);

  useEffect(() => {
    if (isExpired()) {
      logout();
      setIsSplashScreenLoading(false);
    }
  }, []);

  return (
    <div className="bg-green text-navy h-dvh flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Money Tracking</h1>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl">Loading...</h2>

        <div className="bg-light-gray rounded w-40 h-4">
          <div
            className="bg-dark-green rounded h-4"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
