import axios from "axios";
import { atom, useRecoilState } from "recoil";
import "toastify-js/src/toastify.css";
import { createToastify } from "../helpers/toastify";
import { userState } from "./authentication";
import { useCookies } from "react-cookie";

export interface TransactionI {
  _id?: string;
  type: string;
  concept: string;
  category: CategoryI;
  amount: number;
  userId?: string;
}

export interface TransactionFormI extends Omit<TransactionI, "amount"> {
  amount: string;
}

export interface CategoryI {
  _id: string;
  label: string;
}

export const newTransactionState = atom<TransactionFormI | null>({
  key: "newTransactionState",
  default: null,
});

export const transactionsListState = atom<TransactionI[]>({
  key: "transactionsListState",
  default: [],
});

export const selectedTransactionState = atom<TransactionFormI | null>({
  key: "selectedTransactionState",
  default: null,
});

export const categoriesState = atom<CategoryI[]>({
  key: "categoriesState",
  default: [],
});

export const balanceState = atom<number>({
  key: "balanceState",
  default: 0,
});

export const useTranscations = () => {
  const [transactionsList, setTransactionsList] = useRecoilState(
    transactionsListState
  );
  const [user] = useRecoilState(userState);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [balance, setBalance] = useRecoilState(balanceState);
  const [cookies] = useCookies(["jwt"]);

  const port = "http://localhost:3000";

  const getTransactions = async () => {
    try {
      if (user) {
        const response = await axios.get(`${port}/transactions/${user?._id}`, {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        });
        if (response.status === 200) {
          setTransactionsList(response.data);
        } else {
          createToastify({ text: "Transactions not found", type: "error" });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        createToastify({ text: "An error ocurred", type: "error" });
      }
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${port}/transactions/categories`);
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        createToastify({ text: "Categories not found", type: "error" });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        createToastify({ text: "An error ocurred", type: "error" });
      }
    }
  };

  const addTransaction = async (newItem: TransactionFormI) => {
    try {
      const parsedItem = { ...newItem, amount: parseInt(newItem.amount) };
      const response = await axios.post(`${port}/transactions/`, parsedItem);
      if (response.status === 200) {
        setTransactionsList([...transactionsList, response.data]);
      } else {
        createToastify({
          text: "Add Transaction not successful",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        createToastify({ text: "An error ocurred", type: "error" });
      }
    }
  };

  const editTransaction = async (id: string, updatedItem: TransactionFormI) => {
    try {
      const parsedItem = {
        ...updatedItem,
        amount: parseInt(updatedItem.amount),
      };
      const response = await axios.put(
        `${port}/transactions/${id}`,
        parsedItem
      );
      if (response.status === 200) {
        const i = transactionsList.findIndex((elem) => elem._id === id);
        if (i !== -1) {
          setTransactionsList([
            ...transactionsList.slice(0, i),
            response.data,
            ...transactionsList.slice(i + 1),
          ]);
        } else {
          throw new Error("ID not found updating transactions list");
        }
      } else {
        createToastify({
          text: "Edit Transaction not successful",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        createToastify({ text: "An error ocurred", type: "error" });
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await axios.delete(`${port}/transactions/${id}`);
      if (response.status === 200) {
        const i = transactionsList.findIndex((elem) => elem._id === id);
        if (i !== -1) {
          setTransactionsList([
            ...transactionsList.slice(0, i),
            ...transactionsList.slice(i + 1),
          ]);
        } else {
          throw new Error("ID not found deleting transaction");
        }
      } else {
        createToastify({
          text: "Add Transaction not successful",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        createToastify({ text: "An error ocurred", type: "error" });
      }
    }
  };

  const getBalance = async () => {
    try {
      if (user) {
        const response = await axios.get(
          `${port}/transactions/balance/${user?._id}`,
          {
            headers: {
              Authorization: "Bearer " + cookies.jwt,
            },
          }
        );
        setBalance(response.data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        createToastify({ text: "An error ocurred", type: "error" });
      }
    }
  };

  return {
    getTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    transactionsList,
    getCategories,
    categories,
    getBalance,
    balance,
  };
};
