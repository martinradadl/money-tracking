import { useDebts } from "./debts";
import { useTransactions } from "./transactions";
import { useAuth } from "./authentication";
import { getCurrencyFormat } from "../helpers/currency";
import {
  StackedBarChartOptions,
  ChartTabularData,
  DonutChartOptions,
} from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts/interfaces";
import { useShallow } from "zustand/shallow";

export interface DonutChartSetupI {
  [key: string]: {
    data: ChartTabularData;
    options: DonutChartOptions;
  };
}

export interface StackedBarChartSetupI {
  [key: string]: {
    data: StackedBarChartDataI[];
    options: StackedBarChartOptions;
  };
}

export interface StackedBarChartDataI {
  group: string;
  date: string;
  amount: number;
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

const stackedBarChartOptions: StackedBarChartOptions = {
  axes: {
    bottom: {
      title: "Date",
      mapsTo: "date",
      scaleType: ScaleTypes.TIME,
    },
    left: {
      title: "Amount",
      mapsTo: "amount",
      stacked: true,
    },
  },
  height: "400px",
};

export const graphPageTitles = {
  TOTAL_BALANCE: "Total Balance",
  TOTAL_BALANCE_DETAILED: "Total Balance Detailed",
  TRANSACTIONS_BALANCE: "Transactions Balance",
  DEBTS_BALANCE: "Debts Balance",
};

export const useGraphs = () => {
  const {
    totalIncome,
    totalExpenses,
    transactionsChartDataList,
    transactionsTotalBalanceChartDataList,
  } = useTransactions();
  const {
    totalLoans,
    totalDebts,
    debtsChartDataList,
    debtsTotalBalanceChartDataList,
  } = useDebts();
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const totalBalanceDonutChartData = [
    { group: "Transactions", value: Math.abs(totalIncome - totalExpenses) },
    { group: "Debts", value: Math.abs(totalLoans - totalDebts) },
  ];

  const transactionsBalanceDonutChartData = [
    {
      group: "Income",
      value: totalIncome,
    },
    {
      group: "Expenses",
      value: totalExpenses,
    },
  ];

  const debtsBalanceDonutChartData = [
    {
      group: "Loans",
      value: totalLoans,
    },
    {
      group: "Debts",
      value: totalDebts,
    },
  ];

  const totalBalanceDetailedDonutChartData = [
    ...transactionsBalanceDonutChartData,
    ...debtsBalanceDonutChartData,
  ];

  const valueFormatted = (value: number) => {
    return user
      ? getCurrencyFormat({
          currency: user.currency,
          amount: value,
        })
      : "0";
  };

  const totalBalanceDonutChartOptions = {
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

  const totalBalanceDetailedDonutChartOptions = {
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

  const transactionsBalanceDonutChartOptions = {
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

  const debtsBalanceDonutChartOptions = {
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

  const donutChartMappedDataAndOptions: DonutChartSetupI = {
    TOTAL_BALANCE: {
      data: totalBalanceDonutChartData,
      options: totalBalanceDonutChartOptions,
    },
    TOTAL_BALANCE_DETAILED: {
      data: totalBalanceDetailedDonutChartData,
      options: totalBalanceDetailedDonutChartOptions,
    },
    TRANSACTIONS_BALANCE: {
      data: transactionsBalanceDonutChartData,
      options: transactionsBalanceDonutChartOptions,
    },
    DEBTS_BALANCE: {
      data: debtsBalanceDonutChartData,
      options: debtsBalanceDonutChartOptions,
    },
  };

  const totalBalanceDetailedStackedBarChartData = [
    ...transactionsChartDataList,
    ...debtsChartDataList,
  ];

  const totalBalanceStackedBarChartData = [
    ...transactionsTotalBalanceChartDataList,
    ...debtsTotalBalanceChartDataList,
  ];

  const stackedBarChartMappedDataAndOptions: StackedBarChartSetupI = {
    TOTAL_BALANCE: {
      data: totalBalanceStackedBarChartData,
      options: stackedBarChartOptions,
    },
    TOTAL_BALANCE_DETAILED: {
      data: totalBalanceDetailedStackedBarChartData,
      options: stackedBarChartOptions,
    },
    TRANSACTIONS_BALANCE: {
      data: transactionsChartDataList,
      options: stackedBarChartOptions,
    },
    DEBTS_BALANCE: {
      data: debtsChartDataList,
      options: stackedBarChartOptions,
    },
  };

  return {
    donutChartMappedDataAndOptions,
    stackedBarChartMappedDataAndOptions,
  };
};
