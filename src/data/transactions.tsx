import axios from "axios";
import { atom } from "recoil";

export interface TransactionI {
  type: string;
  concept: string;
  category: string;
  amount: number;
}

export const transactions: Array<TransactionI> = [
  {
    type: "income",
    concept: "Sold clothes from Temu",
    category: "Sellings",
    amount: 56,
  },
  {
    type: "expenses",
    concept: "Bought new headphones",
    category: "Tech",
    amount: 130,
  },
  {
    type: "expenses",
    concept: "Went to a Restaurant",
    category: "Food",
    amount: 24,
  },
];

export const newTransactionInitialState: TransactionI = {
  type: "income",
  concept: "",
  category: "",
  amount: 0,
};

export const newTransactionState = atom<TransactionI>({
  key: "newTransactionState",
  default: newTransactionInitialState,
});

export const transactionsListState = atom<TransactionI[]>({
  key: "transactionsListState",
  default: transactions,
});

export const getBalance = (transactions: TransactionI[]) => {
  let balance = 0;
  transactions.forEach((elem) => {
    balance += elem.amount * (elem.type === "income" ? 1 : -1);
  });
  return balance;
};

export const addTransaction = async (newItem: TransactionI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/transactions/",
      newItem
    );
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

export const getTransactions = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/transactions/${userId}`
    );
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

export const editTransaction = async (
  id: string,
  updatedItem: TransactionI
) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/transactions/${id}`,
      updatedItem
    );
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/transactions/${id}`
    );
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};
