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

export function addTransaction(arr: TransactionI[], newItem: TransactionI) {
  return [...arr, newItem];
}

export function editTransaction(
  arr: TransactionI[],
  index: number,
  updatedItem: TransactionI
) {
  return [...arr.slice(0, index), updatedItem, ...arr.slice(index + 1)];
}

export function removeTransaction(arr: TransactionI[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
