import axios, { AxiosError } from "axios";
import { createToastify } from "../helpers/toastify";
import { API_URL } from "../helpers/env";
import { create } from "zustand";

export interface CategoryI {
  _id: string;
  label: string;
}

type State = {
  categories: CategoryI[];
};

type Action = {
  getCategories: () => void;
};

const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`);
    if (response.status === 200) {
      useCategories.setState((state) => {
        return {
          ...state,
          categories: response.data,
        };
      });
    } else {
      createToastify({ text: "Categories not found", type: "error" });
    }
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      createToastify({
        text:
          err instanceof AxiosError ? err.response?.data.message : err.message,
        type: "error",
      });
      throw new Error(err.message);
    }
  }
};

export const useCategories = create<State & Action>(() => {
  return {
    getCategories,
    categories: [],
  };
});
