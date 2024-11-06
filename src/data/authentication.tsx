import axios, { AxiosError } from "axios";
import { atom, useRecoilState } from "recoil";
import { Cookies, useCookies } from "react-cookie";
import { createToastify } from "../helpers/toastify";
import { API_URL } from "../helpers/env";

export interface UserI {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  currency: CurrencyI;
}

export interface LoginI {
  email: string;
  password: string;
}

export interface CurrencyI {
  name: string;
  code: string;
}

export const userState = atom<UserI | null>({
  key: "userState",
  default: null,
});

export const currenciesState = atom<CurrencyI[]>({
  key: "currenciesState",
  default: [],
});

export const checkPassword = async (id: string, password: string) => {
  const cookies = new Cookies();

  try {
    const response = await axios.get(`${API_URL}/auth/${id}/check-password`, {
      headers: {
        Authorization: "Bearer " + cookies.get("jwt"),
        password,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      createToastify({ text: "Could not check password", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      createToastify({
        text: err.response?.data.message || err.message,
        type: "error",
      });
    }
  }
};

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [currencies, setCurrencies] = useRecoilState(currenciesState);
  const [userCookie, setCookie, removeCookie] = useCookies(["user", "jwt"]);

  const logout = () => {
    setUser(null);
    removeCookie("user", { path: "/" });
    removeCookie("jwt", { path: "/" });
  };

  const register = async (newUser: UserI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, newUser);
      if (response.status === 200) {
        setUser(response.data.user);
        setCookie("user", JSON.stringify(response.data.user), { path: "/" });
        setCookie("jwt", JSON.stringify(response.data.token), { path: "/" });
      } else {
        createToastify({ text: "Register not successful", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        createToastify({
          text: "Something went wrong, please contact support",
          type: "error",
        });
      }
    }
  };

  const login = async (loggedUser: LoginI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, loggedUser);
      if (response.status === 200) {
        setUser(response.data.user);
        setCookie("user", JSON.stringify(response.data.user), { path: "/" });
        setCookie("jwt", response.data.token);
      } else {
        createToastify({ text: "Login not successful", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
        throw err;
      }
    }
  };

  const changePassword = async (userId: string, newPassword: string) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/${userId}/change-password`,
        {},
        {
          headers: {
            Authorization: "Bearer " + userCookie.jwt,
            newPassword,
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data);
      } else {
        createToastify({
          text: "Password change not successful",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
      }
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/forgot-password/${email}`
      );
      createToastify({
        text: response.data.message,
        type: "success",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
      }
    }
  };

  const resetPassword = async (
    id: string,
    newPassword: string,
    token: string
  ) => {
    try {
      const response = await axios({
        method: "put",
        url: `${API_URL}/auth/reset-password/${id}`,
        headers: {
          Authorization: "Bearer " + token,
          newPassword,
        },
      });
      if (response.status === 200) {
        setUser(response.data);
        createToastify({
          text: "Password successfully reset",
          type: "success",
        });
      } else {
        createToastify({
          text: "Password change not successful",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
      }
    }
  };

  const editUser = async (id: string, updatedItem: UserI) => {
    try {
      const response = await axios.put(`${API_URL}/auth/${id}`, updatedItem, {
        headers: {
          Authorization: "Bearer " + userCookie.jwt,
        },
      });
      if (response.status === 200) {
        setUser(response.data);
        setCookie("user", JSON.stringify(response.data), { path: "/" });
      } else {
        createToastify({ text: "Edit not successful", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
      }
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/auth/${id}`, {
        headers: {
          Authorization: "Bearer " + userCookie.jwt,
        },
      });
      if (response.status === 200) {
        setUser(null);
        removeCookie("user", { path: "/" });
        removeCookie("jwt", { path: "/" });
      } else {
        createToastify({ text: "Delete not successful", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
      }
    }
  };

  const getCurrencies = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/currencies`);
      if (response.status === 200) {
        setCurrencies(response.data);
      } else {
        createToastify({ text: "Could not get currencies", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
      }
    }
  };

  return {
    register,
    login,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    editUser,
    deleteUser,
    user,
    userCookie,
    getCurrencies,
    currencies,
  };
};
