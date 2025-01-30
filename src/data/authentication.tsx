import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";
import { createToastify } from "../helpers/toastify";
import { API_URL } from "../helpers/env";
import { create } from "zustand";

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

type State = {
  user: UserI | null;
  currencies: CurrencyI[];
};

export const checkPassword = async (id: string, password: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/${id}/check-password`, {
      headers: {
        Authorization: "Bearer " + jwt,
        password,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      createToastify({ text: "Could not check password", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

const cookies = new Cookies();
const jwt = cookies.get("jwt");

export const setUser = (user: UserI | null) =>
  useAuth.setState((state: State) => {
    return {
      ...state,
      user,
    };
  });

export const setCurrencies = (currencies: CurrencyI[]) =>
  useAuth.setState((state: State) => {
    return {
      ...state,
      currencies,
    };
  });

export const logout = () => {
  setUser(null);
  cookies.remove("user", { path: "/" });
  cookies.remove("jwt", { path: "/" });
};

export const register = async (newUser: UserI) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, newUser);
    if (response.status === 200) {
      useAuth.setState((state: State) => {
        return {
          ...state,
          user: response.data.user,
        };
      });
      cookies.set("user", JSON.stringify(response.data.user), { path: "/" });
      cookies.set("jwt", JSON.stringify(response.data.token), { path: "/" });
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

export const login = async (loggedUser: LoginI) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loggedUser);
    if (response.status === 200) {
      useAuth.setState((state: State) => {
        return {
          ...state,
          user: response.data.user,
        };
      });
      cookies.set("user", JSON.stringify(response.data.user), { path: "/" });
      cookies.set("jwt", response.data.token);
    } else {
      createToastify({ text: "Login not successful", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
      throw err;
    }
  }
};

export const changePassword = async (userId: string, newPassword: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/${userId}/change-password`,
      {},
      {
        headers: {
          Authorization: "Bearer " + jwt,
          newPassword,
        },
      }
    );
    if (response.status === 200) {
      useAuth.setState((state: State) => {
        return {
          ...state,
          user: response.data,
        };
      });
    } else {
      createToastify({
        text: "Password change not successful",
        type: "error",
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/auth/forgot-password/${email}`
    );
    createToastify({
      text: response.data.message,
      type: "success",
    });
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

export const resetPassword = async (
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
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

export const editUser = async (id: string, updatedItem: UserI) => {
  try {
    const response = await axios.put(`${API_URL}/auth/${id}`, updatedItem, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      setUser(response.data);
      cookies.set("user", JSON.stringify(response.data), { path: "/" });
    } else {
      createToastify({ text: "Edit not successful", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/auth/${id}`, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      setUser(null);
      cookies.remove("user", { path: "/" });
      cookies.remove("jwt", { path: "/" });
    } else {
      createToastify({ text: "Delete not successful", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

export const getCurrencies = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/currencies`);
    if (response.status === 200) {
      setCurrencies(response.data);
    } else {
      createToastify({ text: "Could not get currencies", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
    }
  }
};

export const useAuth = create<State>(() => {
  return {
    user: null,
    currencies: [],
  };
});
