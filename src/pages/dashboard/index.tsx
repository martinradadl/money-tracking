import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../data/authentication";
import { useTransactions } from "../../data/transactions";
import { useDebts } from "../../data/debts";
import { getCurrencyFormat } from "../../helpers/currency";
import { GraphSkeleton } from "../../components/graphs/graph-skeleton";
import { Graph } from "../../components/graphs/graph";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../data/dashboard";
import { DonutChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useRecoilState(userState);
  const {
    balance,
    getBalance,
    totalIncome,
    getTotalIncome,
    totalExpenses,
    getTotalExpenses,
  } = useTransactions();
  const {
    balance: debtsBalance,
    getBalance: getDebtsBalance,
    totalLoans,
    getTotalLoans,
    totalDebts,
    getTotalDebts,
  } = useDebts();
  const { totalBalance, getTotalBalance } = useDashboard();
  const [isLoading, setIsLoading] = useState(true);

  const getBalances = async () => {
    if (user) {
      await getBalance();
      await getDebtsBalance();
      await getTotalBalance();
      await getTotalIncome();
      await getTotalExpenses();
      await getTotalLoans();
      await getTotalDebts();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBalances();
  }, [user?._id]);

  const transactionsColors = {
    Income: "#41B06E",
    Expenses: "rgb(220,38,38)",
  };

  const debtsColors = {
    Loans: "#41B06E",
    Debts: "rgb(220,38,38)",
  };

  const totalBalanceColors = {
    Income: "#41B06E",
    Expenses: "rgb(220,38,38)",
    Loans: "blue",
    Debts: "orange",
  };

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

  const totalBalanceData = [...transactionsData, ...debtsData];

  const transactionsOptions = {
    title: "Transactions",
    resizable: true,
    color: {
      scale: transactionsColors,
    },
    legend: {
      alignment: "center",
    },
    donut: {
      alignment: "center",
      center: {
        number: balance,
        numberFormatter: (balance: number) =>
          balance >= 0 ? `$${balance}` : `-$${balance * -1}`,
      },
    },
  };

  const debtsOptions = {
    title: "Debts",
    resizable: true,
    color: {
      scale: debtsColors,
    },
    legend: {
      alignment: "center",
    },
    donut: {
      alignment: "center",
      center: {
        number: debtsBalance,
        numberFormatter: (debtsBalance: number) =>
          debtsBalance >= 0 ? `$${debtsBalance}` : `-$${debtsBalance * -1}`,
      },
    },
  };

  const totalBalanceOptions = {
    title: "Total Balance",
    resizable: true,
    color: {
      scale: totalBalanceColors,
    },
    legend: {
      alignment: "center",
    },
    donut: {
      alignment: "center",
      center: {
        number: totalBalance,
        numberFormatter: (totalBalance: number) =>
          totalBalance >= 0 ? `$${totalBalance}` : `-$${totalBalance * -1}`,
      },
    },
  };

  return (
    <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-4 overflow-y-auto entrance-anim">
      <h1 className="page-title text-beige">Hi, {user?.name}</h1>
      <div className="flex flex-col p-2 bg-green rounded">
        <div className="flex w-full justify-between text-2xl font-semibold pb-2">
          <p className="text-navy">Total Balance:</p>
          <p className={totalBalance >= 0 ? "text-beige" : "text-red"}>
            {user
              ? getCurrencyFormat({
                  amount: totalBalance,
                  currency: user.currency,
                })
              : null}
          </p>
        </div>
        <div className="flex w-full justify-between text-xl font-semibold">
          <p className="text-navy">Your Transactions:</p>
          <p className={balance >= 0 ? "text-beige" : "text-red"}>
            {user
              ? getCurrencyFormat({
                  amount: balance,
                  currency: user.currency,
                })
              : null}
          </p>
        </div>
        <div className="flex w-full justify-between text-xl font-semibold">
          <p className="text-navy">Your Debts:</p>
          <p className={debtsBalance >= 0 ? "text-beige" : "text-red"}>
            {user
              ? getCurrencyFormat({
                  amount: debtsBalance,
                  currency: user.currency,
                })
              : null}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center bg-beige rounded p-2">
        <DonutChart data={totalBalanceData} options={totalBalanceOptions} />
      </div>
      <div className="flex flex-wrap bg-beige rounded p-2">
        <div className="flex flex-1">
          <DonutChart data={transactionsData} options={transactionsOptions} />
        </div>
        <div className="flex flex-1">
          <DonutChart data={debtsData} options={debtsOptions} />
        </div>
      </div>
      <h1 className="text-beige text-2xl font-semibold">Your Stats: </h1>
      <div className="flex text-beige gap-3">
        <div
          className="flex flex-col flex-1 items-center cursor-pointer"
          onClick={() => {
            navigate(`/graph`);
          }}
        >
          <p className="text-xl">Transactions</p>
          {isLoading ? <GraphSkeleton /> : <Graph />}
        </div>
        <div
          className="flex flex-col flex-1 items-center cursor-pointer"
          onClick={() => {
            navigate(`/graph`);
          }}
        >
          <p className="text-xl">Debts</p>
          {isLoading ? <GraphSkeleton /> : <Graph />}
        </div>
      </div>
    </div>
  );
};
