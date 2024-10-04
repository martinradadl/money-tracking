import axios, { AxiosError } from "axios";
import { atom, useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { createToastify } from "../helpers/toastify";

export interface UserI {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  currency?: string;
}

export interface LoginI {
  email: string;
  password: string;
}

export const userState = atom<UserI | null>({
  key: "userState",
  default: null,
});

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [userCookie, setCookie] = useCookies(["user", "jwt"]);
  const port = "http://localhost:3000";
  const [cookies] = useCookies(["jwt"]);

  const register = async (newUser: UserI) => {
    try {
      const response = await axios.post(`${port}/auth/register`, newUser, {
        withCredentials: true,
      });
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
        throw new Error(err.message);
      }
    }
  };

  const login = async (loggedUser: LoginI) => {
    try {
      const response = await axios.post(`${port}/auth/login`, loggedUser, {
        withCredentials: true,
      });
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
        throw new Error(err.message);
      }
    }
  };

  const changePassword = async (
    userId: string,
    passwords: { current: string; new: string }
  ) => {
    try {
      const response = await axios.put(
        `${port}/auth/${userId}/change-password`,
        {
          passwords,
          headers: {
            Authorization: "Bearer " + cookies.jwt,
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
        throw new Error(err.message);
      }
    }
  };

  const checkPassword = async (id: string, password: string) => {
    try {
      const response = await axios.get(
        `${port}/auth/${id}/check-password/${password}`,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
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
        throw new Error(err.message);
      }
    }
  };

  const editUser = async (id: string, updatedItem: UserI) => {
    try {
      const response = await axios.put(`${port}/auth/${id}`, {
        updatedItem,
        headers: {
          Authorization: "Bearer " + cookies.jwt,
        },
      });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        createToastify({ text: "Edit not successful", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
        throw new Error(err.message);
      }
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`${port}/transactions/${id}`, {
        headers: {
          Authorization: "Bearer " + cookies.jwt,
        },
      });
      if (response.status === 200) {
        setUser(null);
      } else {
        createToastify({ text: "Delete not successful", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
        throw new Error(err.message);
      }
    }
  };

  return {
    register,
    login,
    changePassword,
    checkPassword,
    editUser,
    deleteUser,
    user,
    userCookie,
  };
};
