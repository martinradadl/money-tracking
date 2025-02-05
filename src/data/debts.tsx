import { CategoryI } from "./categories";
import axios, { AxiosError } from "axios";
import { createToastify } from "../helpers/toastify";
import { Cookies } from "react-cookie";
import { API_URL } from "../helpers/env";
import { noCategory } from "../helpers/categories";
import { create } from "zustand";

type DebtType = "debt" | "loan";

export interface DebtI {
  _id?: string;
  userId?: string;
  type: DebtType;
  entity: string;
  concept: string;
  category: CategoryI;
  amount: number;
}

export interface DebtFormI extends Omit<DebtI, "amount"> {
  amount: string;
}

export const newDebtInitialState: DebtFormI = {
  type: "loan",
  entity: "",
  concept: "",
  category: noCategory,
  amount: "",
};

type State = {
  newDebt: DebtFormI | null;
  selectedDebt: DebtFormI | null;
  debtsList: DebtI[];
  totalLoans: number;
  totalDebts: number;
  isLastPage: boolean;
  page: number;
  isInitialLoad: boolean;
};

const cookies = new Cookies();
const jwt = cookies.get("jwt");
const loansCache = cookies.get("loansCache");
const debtsCache = cookies.get("debtsCache");
const user = cookies.get("user");

export const setNewDebt = (newDebt: DebtFormI | null) =>
  useDebts.setState((state) => {
    return {
      ...state,
      newDebt,
    };
  });

export const setSelectedDebt = (selectedDebt: DebtFormI | null) =>
  useDebts.setState((state) => {
    return {
      ...state,
      selectedDebt,
    };
  });

export const setDebtsList = (debtsList: DebtI[]) =>
  useDebts.setState((state) => {
    return {
      ...state,
      debtsList,
    };
  });

export const setTotalDebts = (totalDebts: number) =>
  useDebts.setState((state) => {
    return {
      ...state,
      totalDebts,
    };
  });

export const setTotalLoans = (totalLoans: number) =>
  useDebts.setState((state) => {
    return {
      ...state,
      totalLoans,
    };
  });

export const setIsLastPage = (isLastPage: boolean) =>
  useDebts.setState((state) => {
    return {
      ...state,
      isLastPage,
    };
  });

export const nextPage = () =>
  useDebts.setState((state) => {
    return {
      ...state,
      page: state.page + 1,
    };
  });

export const setIsInitialLoad = (isInitialLoad: boolean) =>
  useDebts.setState((state) => {
    return {
      ...state,
      isInitialLoad,
    };
  });

export const getDebts = async (page?: number, limit?: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/debts/${user?._id}?page=${page || 1}&limit=${limit || 10}`,
      {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      }
    );
    if (response.status === 200) {
      useDebts.setState((state: State) => {
        const newState = { ...state };
        newState.debtsList = [...newState.debtsList, ...response.data];
        if (limit && response.data.length < limit) {
          newState.isLastPage = true;
        }
        return newState;
      });
    } else {
      createToastify({ text: "Debt or Loan not found", type: "error" });
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

export const addDebt = async (newItem: DebtFormI) => {
  try {
    const parsedItem = {
      ...newItem,
      amount: parseInt(newItem.amount),
      userId: user?._id,
    };
    const response = await axios.post(`${API_URL}/debts/`, parsedItem, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      useDebts.setState((state: State) => {
        return {
          ...state,
          debtsList: [...state.debtsList, response.data],
        };
      });
    } else {
      createToastify({
        text: "Add Debt not successful",
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

export const editDebt = async (id: string, updatedItem: DebtFormI) => {
  try {
    const parsedItem = {
      ...updatedItem,
      amount: parseInt(updatedItem.amount),
      userId: user?._id,
    };
    const response = await axios.put(`${API_URL}/debts/${id}`, parsedItem, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      useDebts.setState((state: State) => {
        const i = state.debtsList.findIndex((elem) => elem._id === id);
        if (i !== -1) {
          return {
            ...state,
            debtsList: [
              ...state.debtsList.slice(0, i),
              response.data,
              ...state.debtsList.slice(i + 1),
            ],
          };
        } else {
          createToastify({
            text: "ID not found updating debts list",
            type: "error",
          });
          return state;
        }
      });
    } else {
      createToastify({
        text: "Edit Debt not successful",
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

export const deleteDebt = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/debts/${id}`, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    });
    if (response.status === 200) {
      useDebts.setState((state: State) => {
        const i = state.debtsList.findIndex((elem) => elem._id === id);
        if (i !== -1) {
          return {
            ...state,
            debtsList: [
              ...state.debtsList.slice(0, i),
              ...state.debtsList.slice(i + 1),
            ],
          };
        } else {
          throw new Error("ID not found deleting debt");
        }
      });
    } else {
      createToastify({
        text: "Add Debt not successful",
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

export const getTotalLoans = async () => {
  if (cookies.get("loansCache")) {
    setTotalLoans(loansCache);
  } else {
    try {
      const response = await axios.get(
        `${API_URL}/debts/balance/loans/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalLoans(response.data);
        cookies.set("loansCache", response.data);
      } else {
        createToastify({
          text: "Could not calculate total loans",
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

export const getTotalDebts = async () => {
  if (cookies.get("debtsCache")) {
    setTotalDebts(debtsCache);
  } else {
    try {
      const response = await axios.get(
        `${API_URL}/debts/balance/debts/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalDebts(response.data);
        cookies.set("debtsCache", response.data);
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

export const useDebts = create<State>(() => {
  return {
    newDebt: null,
    selectedDebt: null,
    debtsList: [] as DebtI[],
    totalLoans: 0,
    totalDebts: 0,
    isLastPage: false,
    page: 1,
    isInitialLoad: true,
  };
});
