import { createToastify } from "../helpers/toastify";
import { Cookies } from "react-cookie";
import { CategoryI } from "./categories";
import { API_URL } from "../helpers/env";
import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { noCategory } from "../helpers/categories";

type TranscationType = "income" | "expenses";

export interface TransactionI {
  _id?: string;
  type: TranscationType;
  concept: string;
  category: CategoryI;
  amount: number;
  userId?: string;
}

export interface TransactionFormI extends Omit<TransactionI, "amount"> {
  amount: string;
}

export const newTransactionInitialState: TransactionFormI = {
  type: "income",
  concept: "",
  category: noCategory,
  amount: "",
};

const cookies = new Cookies();
const jwt = cookies.get("jwt");
const incomeCache = cookies.get("incomeCache");
const expensesCache = cookies.get("expensesCache");
const user = cookies.get("user");

export const setNewTransaction = (newTransaction) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      newTransaction,
    };
  });

export const setSelectedTransaction = (selectedTransaction) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      selectedTransaction,
    };
  });

export const setTransactionsList = (transactionsList) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      transactionsList,
    };
  });

export const setTotalExpenses = (totalExpenses) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      totalExpenses,
    };
  });

export const setTotalIncome = (totalIncome) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      totalIncome,
    };
  });

export const setIsLastPage = (isLastPage) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      isLastPage,
    };
  });

const getTransactions = async (page?: number, limit?: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/transactions/${user?._id}?page=${page || 1}&limit=${
        limit || 10
      }`,
      {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );
    if (response.status === 200) {
      useTransactions.setState((state) => {
        const newState = { ...state };
        newState.transactionsList = [
          ...newState.transactionsList,
          ...response.data,
        ];
        if (limit && response.data.length < limit) {
          newState.isLastPage = true;
        }
        return newState;
      });
    } else {
      createToastify({ text: "Transactions not found", type: "error" });
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

export const addTransaction = async (newItem: TransactionFormI) => {
  try {
    const parsedItem = {
      ...newItem,
      amount: parseInt(newItem.amount),
      userId: user?._id,
    };
    const response = await axios.post(`${API_URL}/transactions/`, parsedItem, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      const a = () =>
        useTransactions.setState((state) => {
          return {
            transactionsList: [...state.transactionsList, ...response.data],
          };
        });
      a();
    } else {
      createToastify({
        text: "Add Transaction not successful",
        type: "error",
      });
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

const editTransaction = async (id: string, updatedItem: TransactionFormI) => {
  try {
    const parsedItem = {
      ...updatedItem,
      amount: parseInt(updatedItem.amount),
      userId: user?._id,
    };
    const response = await axios.put(
      `${API_URL}/transactions/${id}`,
      parsedItem,
      {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );
    if (response.status === 200) {
      const i = transactionsList.findIndex((elem) => elem._id === id);
      if (i !== -1) {
        useTransactions.setState((state) => {
          return {
            ...state,
            transactionsList: [
              ...state.transactionsList.slice(0, i),
              ...response.data,
              ...state.transactionsList.slice(i + 1),
            ],
          };
        });
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
    if (err instanceof AxiosError) {
      createToastify({
        text: err.response?.data.message || err.message,
        type: "error",
      });
      throw new Error(err.message);
    }
  }
};

const deleteTransaction = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/transactions/${id}`, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      const i = transactionsList.findIndex((elem) => elem._id === id);
      if (i !== -1) {
        useTransactions.setState((state) => {
          return {
            ...state,
            transactionsList: [
              ...state.transactionsList.slice(0, i),
              ...state.transactionsList.slice(i + 1),
            ],
          };
        });
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
    if (err instanceof AxiosError) {
      createToastify({
        text: err.response?.data.message || err.message,
        type: "error",
      });
      throw new Error(err.message);
    }
  }
};

const getTotalIncome = async () => {
  if (cookies.get("incomeCache")) {
    try {
      setTotalIncome(incomeCache);
    } catch (e) {
      createToastify({
        text: "Could not calculate total income",
        type: "error",
      });
    }
  } else {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/income/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalIncome(response.data);
        cookies.set("incomeCache", response.data);
      } else {
        createToastify({
          text: "Could not calculate total income",
          type: "error",
        });
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
  }
};

const getTotalExpenses = async () => {
  if (cookies.get("expensesCache")) {
    try {
      setTotalExpenses(expensesCache);
    } catch (e) {
      createToastify({
        text: "Could not calculate total expenses",
        type: "error",
      });
    }
  } else {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/expenses/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalExpenses(response.data);
        cookies.set("expensesCache", response.data);
      } else {
        createToastify({
          text: "Could not calculate total expenses",
          type: "error",
        });
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
  }
};

export const useTransactions = create((set) => {
  return {
    newTransaction: null,
    selectedTransaction: null,
    transactionsList: [],
    totalIncome: 0,
    totalExpenses: 0,
    isLastPage: false,
    getTransactions,
    editTransaction,
    deleteTransaction,
    getTotalIncome,
    getTotalExpenses,
  };
});
