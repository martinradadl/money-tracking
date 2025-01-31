import { useDebts } from "./debts";
import { useTransactions } from "./transactions";
import { useAuth } from "./authentication";
import { getCurrencyFormat } from "../helpers/currency";
import { ChartTabularData, DonutChartOptions } from "@carbon/charts-react";
import { useShallow } from "zustand/shallow";

export interface DonutChartSetupI {
  [key: string]: { data: ChartTabularData; options: DonutChartOptions };
}

const GREEN = "#41B06E";
const RED = "rgb(220,38,38)";
const BLUE = "blue";
const ORANGE = "orange";

const totalBalanceColors = {
  Transactions: BLUE,
  Debts: ORANGE,
};

const totalBalanceDetailedColors = {
  Income: GREEN,
  Expenses: RED,
  Loans: BLUE,
  Debts: ORANGE,
};

const transactionsColors = {
  Income: GREEN,
  Expenses: RED,
};

const debtsColors = {
  Loans: GREEN,
  Debts: RED,
};

const donutChartOptions = {
  resizable: true,
  toolbar: { enabled: false },
  legend: {
    alignment: "center",
  },
  donut: {
    alignment: "center",
  },
};

export const useGraphs = () => {
  const { totalIncome, totalExpenses } = useTransactions();
  const { totalLoans, totalDebts } = useDebts();
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const totalBalanceData = [
    { group: "Transactions", value: Math.abs(totalIncome - totalExpenses) },
    { group: "Debts", value: Math.abs(totalLoans - totalDebts) },
  ];

  const transactionsData = [
    {
      group: "Income",
      value: totalIncome,
    },
    {
      group: "Expenses",
      value: totalExpenses,
    },
  ];

  const debtsData = [
    {
      group: "Loans",
      value: totalLoans,
    },
    {
      group: "Debts",
      value: totalDebts,
    },
  ];

  const totalBalanceDetailedData = [...transactionsData, ...debtsData];

  const valueFormatted = (value: number) => {
    return user
      ? getCurrencyFormat({
          currency: user.currency,
          amount: value,
        })
      : "0";
  };

  const totalBalanceOptions = {
    ...donutChartOptions,
    color: {
      scale: totalBalanceColors,
    },
    donut: {
      ...donutChartOptions.donut,
      center: {
        number: totalIncome - totalExpenses + totalLoans - totalDebts,
        numberFormatter: valueFormatted,
      },
    },
  };

  const totalBalanceDetailedOptions = {
    ...donutChartOptions,
    color: {
      scale: totalBalanceDetailedColors,
    },
    donut: {
      ...donutChartOptions.donut,
      center: {
        number: totalIncome - totalExpenses + totalLoans - totalDebts,
        numberFormatter: valueFormatted,
      },
    },
  };

  const transactionsOptions = {
    ...donutChartOptions,
    color: {
      scale: transactionsColors,
    },
    donut: {
      ...donutChartOptions.donut,
      center: {
        number: totalIncome - totalExpenses,
        numberFormatter: valueFormatted,
      },
    },
  };

  const debtsOptions = {
    ...donutChartOptions,
    color: {
      scale: debtsColors,
    },
    donut: {
      ...donutChartOptions.donut,
      center: {
        number: totalLoans - totalDebts,
        numberFormatter: valueFormatted,
      },
    },
  };

  const mappedDataAndOptions: DonutChartSetupI = {
    TOTAL_BALANCE: {
      data: totalBalanceData,
      options: totalBalanceOptions,
    },
    TOTAL_BALANCE_DETAILED: {
      data: totalBalanceDetailedData,
      options: totalBalanceDetailedOptions,
    },
    TRANSACTIONS_BALANCE: {
      data: transactionsData,
      options: transactionsOptions,
    },
    DEBTS_BALANCE: {
      data: debtsData,
      options: debtsOptions,
    },
  };

  return {
    mappedDataAndOptions,
  };
};
