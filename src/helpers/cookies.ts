import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const user = () => cookies.get("user");
export const jwt = () => cookies.get("jwt");
export const incomeCache = () => cookies.get("incomeCache");
export const expensesCache = () => cookies.get("expensesCache");
export const loansCache = () => cookies.get("loansCache");
export const debtsCache = () => cookies.get("debtsCache");

export const setCookie = (name: string, value: typeof Cookies) => {
  cookies.set(name, value);
};

export const setCookieWithPath = (name: string, value: string) => {
  cookies.set(name, value, { path: "/" });
};

export const clearCookies = () => {
  cookies.remove("user", { path: "/" });
  cookies.remove("jwt", { path: "/" });
  cookies.remove("incomeCache", { path: "/" });
  cookies.remove("expensesCache", { path: "/" });
  cookies.remove("loansCache", { path: "/" });
  cookies.remove("debtsCache", { path: "/" });
};
