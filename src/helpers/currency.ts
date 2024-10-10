import { CurrencyI } from "../data/authentication";

export type monetaryValueI = {
  currency: CurrencyI;
  amount: number;
};

export const getCurrencyFormat = (value: monetaryValueI) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: value.currency.code,
    minimumFractionDigits: 0,
  }).format(value.amount)}`;
};
