import axios from "axios";
import { atom, useRecoilState } from "recoil";
import Toastify from "toastify-js";
import { useCookies /* Cookies*/ } from "react-cookie";

export interface UserI {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginI {
  email: string;
  password: string;
}

// const cookies = new Cookies();

export const userState = atom<UserI | null>({
  key: "userState",
  default: null,
});

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [userCookie, setCookie /*removeCookie*/] = useCookies(["user"]);
  const port = "http://localhost:3000";

  const register = async (newUser: UserI) => {
    try {
      const response = await axios.post(`${port}/auth/register`, newUser, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data);
        setCookie("user", JSON.stringify(response.data));
      } else {
        Toastify({
          text: "Register not successful",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        Toastify({
          text: "An error ocurred",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    }
  };

  const login = async (loggedUser: LoginI) => {
    try {
      const response = await axios.post(`${port}/auth/login`, loggedUser, {
        withCredentials: true,
      });
      console.log(response.headers["Set-ookie"]);
      if (response.status === 200) {
        setUser(response.data);
        setCookie("user", JSON.stringify(response.data));
      } else {
        Toastify({
          text: "Login not successful",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        Toastify({
          text: "An error ocurred",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    }
  };

  const editUser = async (id: string, updatedItem: UserI) => {
    try {
      const response = await axios.put(`${port}/auth/${id}`, updatedItem);
      if (response.status === 200) {
        setUser(response.data);
      } else {
        Toastify({
          text: "Edit not successful",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        Toastify({
          text: "An error ocurred",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`${port}/transactions/${id}`);
      if (response.status === 200) {
        setUser(null);
      } else {
        Toastify({
          text: "Delete not successful",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        Toastify({
          text: "An error ocurred",
          duration: 3000,
          style: { background: "red" },
        }).showToast();
      }
    }
  };

  return {
    register,
    login,
    editUser,
    deleteUser,
    user,
    userCookie,
  };
};
