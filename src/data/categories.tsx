import axios, { AxiosError } from "axios";
import { atom, useRecoilState } from "recoil";
import { createToastify } from "../helpers/toastify";

export interface CategoryI {
  _id: string;
  label: string;
}

export const categoriesState = atom<CategoryI[]>({
  key: "categoriesState",
  default: [],
});

export const port = "http://localhost:3000";

export const useCategories = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${port}/categories/`);
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        createToastify({ text: "Categories not found", type: "error" });
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

  return { getCategories, categories };
};
