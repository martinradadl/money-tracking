import { CurrencyI } from "../data/authentication";

export type MonetaryValueI = {
  currency: CurrencyI;
  amount: number;
};

export const getCurrencyFormat = (value: MonetaryValueI) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: value.currency.code,
    minimumFractionDigits: 0,
  }).format(value.amount)}`;
};
