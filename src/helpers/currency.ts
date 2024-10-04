export type monetaryValueI = {
  currency: "USD" | "EUR" | "COP";
  amount: number;
};

export const getCurrencyFormat = (value: monetaryValueI) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: 0,
  }).format(value.amount)}`;
};
