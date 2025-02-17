import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const user = () => cookies.get("user");
export const jwt = () => cookies.get("jwt");
export const incomeCache = () => cookies.get("incomeCache");
export const expensesCache = () => cookies.get("expensesCache");
export const loansCache = () => cookies.get("loansCache");
export const debtsCache = () => cookies.get("debtsCache");
export const expiresOn = () => cookies.get("expiresOn");

export const setCookie: typeof cookies.set = (name, value) => {
  cookies.set(name, value, { path: "/" });
};

export const removeCookie = (name: string) => {
  cookies.remove(name, { path: "/" });
};

export const clearCookies = () => {
  cookies.remove("user", { path: "/" });
  cookies.remove("jwt", { path: "/" });
  cookies.remove("incomeCache", { path: "/" });
  cookies.remove("expensesCache", { path: "/" });
  cookies.remove("loansCache", { path: "/" });
  cookies.remove("debtsCache", { path: "/" });
  cookies.remove("expiresOn", { path: "/" });
};
