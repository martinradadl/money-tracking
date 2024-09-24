import axios from "axios";
import { atom, useRecoilState } from "recoil";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export interface TransactionI {
  _id?: string;
  type: string;
  concept: string;
  category: CategoryI;
  amount: number;
  userId: string;
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
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [balance, setBalance] = useRecoilState(balanceState);

  const port = "http://localhost:3000";

  const getTransactions = async (userId: string) => {
    try {
      const response = await axios.get(`${port}/transactions/${userId}`);
      if (response.status === 200) {
        setTransactionsList(response.data);
      } else {
        Toastify({
          text: "Transactions not found",
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

  const getCategories = async () => {
    try {
      const response = await axios.get(`${port}/transactions/categories`);
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        Toastify({
          text: "Categories not successful",
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

  const addTransaction = async (newItem: TransactionFormI) => {
    try {
      const parsedItem = { ...newItem, amount: parseInt(newItem.amount) };
      const response = await axios.post(`${port}/transactions/`, parsedItem);
      if (response.status === 200) {
        setTransactionsList([...transactionsList, response.data]);
      } else {
        Toastify({
          text: "Add not successful",
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
        Toastify({
          text: "Add not successful",
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

  const getBalance = async (userId: string) => {
    try {
      const response = await axios.get(
        `${port}/transactions/balance/${userId}`
      );
      setBalance(response.data);
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
