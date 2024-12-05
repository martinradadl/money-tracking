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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useRecoilState(userState);
  const { balance, getBalance } = useTransactions();
  const { balance: debtsBalance, getBalance: getDebtsBalance } = useDebts();
  const { totalBalance, getTotalBalance } = useDashboard();
  const [isLoading, setIsLoading] = useState(true);

  const getBalances = async () => {
    if (user) {
      await getBalance();
      await getDebtsBalance();
      await getTotalBalance();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBalances();
  }, [user?._id]);

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
