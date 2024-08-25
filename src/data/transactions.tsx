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

export const newTransactionInitialState: TransactionI = {
  type: "income",
  concept: "",
  category: "",
  amount: 0,
  userId: "",
};

export const firstTransaction = {
  _id: "01",
  type: "income",
  concept: "August Salary",
  category: "Salary",
  amount: 999,
  userId: "1234",
};

export const newTransactionState = atom<TransactionI>({
  key: "newTransactionState",
  default: newTransactionInitialState,
});

export const transactionsListState = atom<TransactionI[]>({
  key: "transactionsListState",
  default: [firstTransaction],
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
  const getTransactions = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/transactions/${userId}`
      );
      setTransactionsList(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const addTransaction = async (newItem: TransactionI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/transactions/",
        newItem
      );
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
        `http://localhost:3000/transactions/${id}`,
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
      await axios.delete(`http://localhost:3000/transactions/${id}`);
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
