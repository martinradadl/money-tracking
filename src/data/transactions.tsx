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

export const newTransactionState = atom<TransactionI | null>({
  key: "newTransactionState",
  default: null,
});

export const transactionsListState = atom<TransactionI[]>({
  key: "transactionsListState",
  default: [],
});

export const selectedTransactionState = atom<TransactionI | null>({
  key: "selectedTransactionState",
  default: null,
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

  const addTransaction = async (newItem: TransactionI) => {
    try {
      const response = await axios.post(`${port}/transactions/`, newItem);
      setTransactionsList([...transactionsList, response.data]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };
  const editTransaction = async (id: string, updatedItem: TransactionI) => {
    try {
      const response = await axios.put(
        `${port}/transactions/${id}`,
        updatedItem
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
  };
};
