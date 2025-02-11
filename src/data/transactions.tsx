import { createToastify } from "../helpers/toastify";
import { CategoryI } from "./categories";
import { API_URL } from "../helpers/env";
import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { noCategory } from "../helpers/categories";
import {
  expensesCache,
  incomeCache,
  jwt,
  setCookieWithPath,
  user,
} from "../helpers/cookies";

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

type State = {
  newTransaction: TransactionFormI | null;
  selectedTransaction: TransactionFormI | null;
  transactionsList: TransactionI[];
  totalIncome: number;
  totalExpenses: number;
  isLastPage: boolean;
  page: number;
  isInitialLoad: boolean;
};

const initialState = {
  newTransaction: null,
  selectedTransaction: null,
  transactionsList: [] as TransactionI[],
  totalIncome: 0,
  totalExpenses: 0,
  isLastPage: false,
  page: 1,
  isInitialLoad: true,
};

export const setTransactionsInitialState = () => {
  return useTransactions.setState(() => {
    return initialState;
  });
};

export const setNewTransaction = (newTransaction: TransactionFormI | null) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      newTransaction,
    };
  });

export const setSelectedTransaction = (
  selectedTransaction: TransactionFormI | null
) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      selectedTransaction,
    };
  });

export const setTransactionsList = (transactionsList: TransactionI[]) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      transactionsList,
    };
  });

export const setTotalExpenses = (totalExpenses: number) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      totalExpenses,
    };
  });

export const setTotalIncome = (totalIncome: number) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      totalIncome,
    };
  });

export const setIsLastPage = (isLastPage: boolean) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      isLastPage,
    };
  });

export const nextPage = () =>
  useTransactions.setState((state) => {
    return {
      ...state,
      page: state.page + 1,
    };
  });

export const setIsInitialLoad = (isInitialLoad: boolean) =>
  useTransactions.setState((state) => {
    return {
      ...state,
      isInitialLoad,
    };
  });

export const getTransactions = async (page?: number, limit?: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/transactions/${user()?._id}?page=${page || 1}&limit=${
        limit || 10
      }`,
      {
        headers: {
          Authorization: `Bearer ${jwt()}`,
        },
      }
    );
    if (response.status === 200) {
      useTransactions.setState((state: State) => {
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

export const addTransaction = async (newItem: TransactionFormI) => {
  try {
    const parsedItem = {
      ...newItem,
      amount: parseInt(newItem.amount),
      userId: user()?._id,
    };
    const response = await axios.post(`${API_URL}/transactions/`, parsedItem, {
      headers: {
        Authorization: `Bearer ${jwt()}`,
      },
    });
    if (response.status === 200) {
      useTransactions.setState((state) => {
        return {
          transactionsList: [...state.transactionsList, response.data],
        };
      });
    } else {
      createToastify({
        text: "Add Transaction not successful",
        type: "error",
      });
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

export const editTransaction = async (
  id: string,
  updatedItem: TransactionFormI
) => {
  try {
    const parsedItem = {
      ...updatedItem,
      amount: parseInt(updatedItem.amount),
      userId: user()?._id,
    };
    const response = await axios.put(
      `${API_URL}/transactions/${id}`,
      parsedItem,
      {
        headers: {
          Authorization: `Bearer ${jwt()}`,
        },
      }
    );
    if (response.status === 200) {
      useTransactions.setState((state) => {
        const i = state.transactionsList.findIndex((elem) => elem._id === id);
        if (i !== -1) {
          return {
            ...state,
            transactionsList: [
              ...state.transactionsList.slice(0, i),
              response.data,
              ...state.transactionsList.slice(i + 1),
            ],
          };
        } else {
          createToastify({
            text: "ID not found updating transactions list",
            type: "error",
          });
          return state;
        }
      });
    } else {
      createToastify({
        text: "Edit Transaction not successful",
        type: "error",
      });
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

export const deleteTransaction = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt()}`,
      },
    });
    if (response.status === 200) {
      useTransactions.setState((state) => {
        const i = state.transactionsList.findIndex((elem) => elem._id === id);
        if (i !== -1) {
          return {
            ...state,
            transactionsList: [
              ...state.transactionsList.slice(0, i),
              ...state.transactionsList.slice(i + 1),
            ],
          };
        } else {
          throw new Error("ID not found deleting transaction");
        }
      });
    } else {
      createToastify({
        text: "Add Transaction not successful",
        type: "error",
      });
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

export const getTotalIncome = async () => {
  const incomeCacheTemp = incomeCache();
  if (incomeCacheTemp) {
    setTotalIncome(incomeCacheTemp);
  } else {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/income/${user()?._id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt()}`,
          },
        }
      );
      if (response.status === 200) {
        setTotalIncome(response.data);
        setCookieWithPath("incomeCache", response.data);
      } else {
        createToastify({
          text: "Could not calculate total income",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AxiosError) {
        createToastify({
          text:
            err instanceof AxiosError
              ? err.response?.data.message
              : err.message,
          type: "error",
        });
        throw new Error(err.message);
      }
    }
  }
};

export const getTotalExpenses = async () => {
  const expensesCacheTemp = expensesCache();
  if (expensesCacheTemp) {
    setTotalExpenses(expensesCacheTemp);
  } else {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/expenses/${user()?._id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt()}`,
          },
        }
      );
      if (response.status === 200) {
        setTotalExpenses(response.data);
        setCookieWithPath("expensesCache", response.data);
      } else {
        createToastify({
          text: "Could not calculate total expenses",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof AxiosError) {
        createToastify({
          text:
            err instanceof AxiosError
              ? err.response?.data.message
              : err.message,
          type: "error",
        });
        throw new Error(err.message);
      }
    }
  }
};

export const useTransactions = create<State>(() => {
  return initialState;
});
