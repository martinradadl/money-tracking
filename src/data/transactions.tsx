import axios from "axios";
import { atom, useRecoilState } from "recoil";

export interface TransactionI {
  _id?: string;
  type: string;
  concept: string;
  category: string;
  amount: number;
  userId: string;
}

export interface TransactionFormI extends Omit<TransactionI, "amount"> {
  amount: string;
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

export const categoriesState = atom<string[]>({
  key: "categoriesState",
  default: [],
});

export const getBalance = (transactions: TransactionI[]) => {
  let balance = 0;
  transactions.forEach((elem) => {
    balance += elem.amount * (elem.type === "income" ? 1 : -1);
  });
  return balance;
};

export const useTranscations = () => {
  const [transactionsList, setTransactionsList] = useRecoilState(
    transactionsListState
  );
  const [, setCategories] = useRecoilState(categoriesState);
  const port = "http://localhost:3000";

  const getTransactions = async (userId: string) => {
    try {
      const response = await axios.get(`${port}/transactions/${userId}`);
      setTransactionsList(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${port}/transactions/categories`);
      setCategories(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const addTransaction = async (newItem: TransactionFormI) => {
    try {
      const parsedItem = { ...newItem, amount: parseInt(newItem.amount) };
      const response = await axios.post(`${port}/transactions/`, parsedItem);
      setTransactionsList([...transactionsList, response.data]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`${port}/transactions/${id}`);
      const i = transactionsList.findIndex((elem) => elem._id === id);
      if (i !== -1) {
        setTransactionsList([
          ...transactionsList.slice(0, i),
          ...transactionsList.slice(i + 1),
        ]);
      } else {
        throw new Error("ID not found deleting transaction");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
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
  };
};
