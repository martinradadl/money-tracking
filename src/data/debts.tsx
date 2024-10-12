import { atom, useRecoilState } from "recoil";
import { CategoryI, port } from "./categories";
import { userState } from "./authentication";
import axios, { AxiosError } from "axios";
import { createToastify } from "../helpers/toastify";
import { useCookies } from "react-cookie";

export type DebtType = 'debt' | 'loan'

export interface DebtI {
  _id?: string;
  userId?: string;
  type: DebtType;
  beneficiary: string;
  concept: string;
  category: CategoryI;
  amount: number;
}

export interface DebtFormI extends Omit<DebtI, "amount"> {
  amount: string;
}

export const newDebtState = atom<DebtFormI | null>({
  key: "newDebtState",
  default: null,
});

export const debtsListState = atom<DebtI[]>({
  key: "debtsListState",
  default: [],
});

export const selectedDebtState = atom<DebtFormI | null>({
  key: "selectedDebtState",
  default: null,
});

export const useDebts = () => {
  const [debtsList, setDebtsList] = useRecoilState(debtsListState);
  const [user] = useRecoilState(userState);
  const [cookies] = useCookies(["jwt"]);

  const getDebts = async () => {
    try {
      if (user) {
        const response = await axios.get(`${port}/debts/${user?._id}`, {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        });
        if (response.status === 200) {
          setDebtsList(response.data);
        } else {
          createToastify({ text: "Debt or Loan not found", type: "error" });
        }
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

  const addDebt = async (newItem: DebtFormI) => {
    try {
      if (user) {
        const parsedItem = {
          ...newItem,
          amount: parseInt(newItem.amount),
          userId: user._id,
        };
        const response = await axios.post(`${port}/debts/`, parsedItem, {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        });
        if (response.status === 200) {
          setDebtsList([...debtsList, response.data]);
        } else {
          createToastify({
            text: "Add Debt not successful",
            type: "error",
          });
        }
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

  const editDebt = async (id: string, updatedItem: DebtFormI) => {
    try {
      if (user) {
        const parsedItem = {
          ...updatedItem,
          amount: parseInt(updatedItem.amount),
          userId: user._id,
        };
        const response = await axios.put(`${port}/debts/${id}`, parsedItem, {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        });
        if (response.status === 200) {
          const i = debtsList.findIndex((elem) => elem._id === id);
          if (i !== -1) {
            setDebtsList([
              ...debtsList.slice(0, i),
              response.data,
              ...debtsList.slice(i + 1),
            ]);
          } else {
            throw new Error("ID not found updating debts list");
          }
        } else {
          createToastify({
            text: "Edit Debt not successful",
            type: "error",
          });
        }
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

  const deleteDebt = async (id: string) => {
    try {
      if (user) {
        const response = await axios.delete(`${port}/debts/${id}`, {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        });
        if (response.status === 200) {
          const i = debtsList.findIndex((elem) => elem._id === id);
          if (i !== -1) {
            setDebtsList([...debtsList.slice(0, i), ...debtsList.slice(i + 1)]);
          } else {
            throw new Error("ID not found deleting debt");
          }
        } else {
          createToastify({
            text: "Add Debt not successful",
            type: "error",
          });
        }
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

  return { getDebts, addDebt, editDebt, deleteDebt, debtsList };
};
