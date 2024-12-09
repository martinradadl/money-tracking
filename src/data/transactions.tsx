import axios, { AxiosError } from "axios";
import { atom, useRecoilState } from "recoil";
import "toastify-js/src/toastify.css";
import { createToastify } from "../helpers/toastify";
import { userState } from "./authentication";
import { useCookies } from "react-cookie";
import { CategoryI } from "./categories";
import { API_URL } from "../helpers/env";

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

export const balanceState = atom<number>({
  key: "balanceState",
  default: 0,
});

export const totalIncomeState = atom<number>({
  key: "totalIncomeState",
  default: 0,
});

export const totalExpensesState = atom<number>({
  key: "totalExpensesState",
  default: 0,
});

export const isLastPageState = atom<boolean>({
  key: "isLastPageState",
  default: false,
});

export const useTransactions = () => {
  const [transactionsList, setTransactionsList] = useRecoilState(
    transactionsListState
  );
  const [user] = useRecoilState(userState);
  const [balance, setBalance] = useRecoilState(balanceState);
  const [totalIncome, setTotalIncome] = useRecoilState(totalIncomeState);
  const [totalExpenses, setTotalExpenses] = useRecoilState(totalExpensesState);
  const [isLastPage, setIsLastPage] = useRecoilState(isLastPageState);
  const [cookies] = useCookies(["jwt"]);

  const getTransactions = async (page?: number, limit?: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/${user?._id}?page=${page || 1}&limit=${
          limit || 10
        }`,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
      if (response.status === 200) {
        setTransactionsList([...transactionsList, ...response.data]);
        if (limit && response.data.length < limit) {
          setIsLastPage(true);
        }
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

  const addTransaction = async (newItem: TransactionFormI) => {
    try {
      const parsedItem = {
        ...newItem,
        amount: parseInt(newItem.amount),
        userId: user?._id,
      };
      const response = await axios.post(
        `${API_URL}/transactions/`,
        parsedItem,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
      if (response.status === 200) {
        setTransactionsList([...transactionsList, response.data]);
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
            Authorization: "Bearer " + cookies.jwt,
          },
        }
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
          Authorization: "Bearer " + cookies.jwt,
        },
      });
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
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
        throw new Error(err.message);
      }
    }
  };

  const getBalance = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
      if (response.status === 200) {
        setBalance(response.data);
      } else {
        createToastify({
          text: "Could not calculate balance",
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
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/income/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalIncome(response.data);
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
  };

  const getTotalExpenses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/balance/expenses/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalExpenses(response.data);
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
  };

  return {
    getTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    transactionsList,
    getBalance,
    balance,
    totalIncome,
    getTotalIncome,
    totalExpenses,
    getTotalExpenses,
    isLastPage,
  };
};
