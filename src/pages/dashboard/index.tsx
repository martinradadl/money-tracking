import React, { useEffect } from "react";
import { useAuth } from "../../data/authentication";
import { getTotalIncome, getTotalExpenses } from "../../data/transactions";
import { getTotalLoans, getTotalDebts } from "../../data/debts";
import { useNavigate } from "react-router-dom";
import { DonutChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import { useGraphs } from "../../data/graphs";
import { useShallow } from "zustand/shallow";
import { NoDataChart } from "../../components/no-data-chart";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );
  const { mappedDataAndOptions } = useGraphs();
  const {
    TOTAL_BALANCE,
    TOTAL_BALANCE_DETAILED,
    DEBTS_BALANCE,
    TRANSACTIONS_BALANCE,
  } = mappedDataAndOptions;

  const getBalances = async () => {
    Promise.all([
      getTotalIncome({}),
      getTotalExpenses({}),
      getTotalLoans({}),
      getTotalDebts({}),
    ]);
  };

  useEffect(() => {
    if (user?._id) {
      getBalances();
    }
  }, [user?._id]);

  return (
    <div className="flex flex-col m-auto flex-1 pt-2 pb-14 px-5 gap-4 overflow-y-auto entrance-anim w-4/5 max-w-[1000px]">
      <h1 className="page-title text-beige">Hi, {user?.name}</h1>
      <h2 className="text-beige text-2xl font-semibold">Your Balances: </h2>
      <div className="bg-beige rounded p-2 flex flex-wrap gap-1">
        <div className="w-full md:flex-1 pb-2">
          <h3 className="text-navy text-xl font-semibold text-center">
            Total Balance{" "}
          </h3>
          {TOTAL_BALANCE.data[0].value === 0 &&
          TOTAL_BALANCE.data[1].value === 0 ? (
            <div className="flex flex-col justify-center">
              <NoDataChart />
            </div>
          ) : (
            <div className="w-full md:flex-1 pb-2">
              <div className="flex w-full aspect-square p-2 md:flex-1 md:w-auto">
                <DonutChart
                  data={TOTAL_BALANCE.data}
                  options={TOTAL_BALANCE.options}
                />
              </div>
              <button
                onClick={() => {
                  navigate(`/graph?graphCode=TOTAL_BALANCE`);
                }}
                className="bg-navy text-beige font-bold block m-auto rounded py-1 px-2 self-center text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Full Screen
              </button>
            </div>
          )}
        </div>
        <div className="w-full md:flex-1 pb-2">
          <h3 className="text-navy text-xl font-semibold text-center">
            Detailed Balance
          </h3>
          {TOTAL_BALANCE_DETAILED.data[0].value === 0 &&
          TOTAL_BALANCE_DETAILED.data[1].value === 0 ? (
            <div className="flex flex-col justify-center">
              <NoDataChart />
            </div>
          ) : (
            <div className="w-full md:flex-1 pb-2">
              <div className="flex w-full aspect-square p-2 md:flex-1 md:w-auto">
                <DonutChart
                  data={TOTAL_BALANCE_DETAILED.data}
                  options={TOTAL_BALANCE_DETAILED.options}
                />
              </div>
              <button
                onClick={() => {
                  navigate(`/graph?graphCode=TOTAL_BALANCE_DETAILED`);
                }}
                className="bg-navy text-beige font-bold block m-auto rounded py-1 px-2 self-center text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Full Screen
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-beige rounded p-2 flex flex-wrap gap-1">
        <div className="w-full md:flex-1 pb-2">
          <h3 className="text-navy text-xl font-semibold text-center">
            Transactions{" "}
          </h3>

          {TRANSACTIONS_BALANCE.data[0].value === 0 &&
          TRANSACTIONS_BALANCE.data[1].value === 0 ? (
            <div className="flex flex-col justify-center">
              <NoDataChart />
            </div>
          ) : (
            <>
              <div className="flex w-full aspect-square p-2 md:flex-1 md:w-auto">
                <DonutChart
                  data={TRANSACTIONS_BALANCE.data}
                  options={TRANSACTIONS_BALANCE.options}
                />
              </div>
              <button
                onClick={() => {
                  navigate(`/graph?graphCode=TRANSACTIONS_BALANCE`);
                }}
                className="bg-navy text-beige font-bold block m-auto rounded py-1 px-2 self-center text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Full Screen
              </button>
            </>
          )}
        </div>
        <div className="w-full md:flex-1 pb-2">
          <h3 className="text-navy text-xl font-semibold text-center">
            Debts{" "}
          </h3>
          {DEBTS_BALANCE.data[0].value === 0 &&
          DEBTS_BALANCE.data[1].value === 0 ? (
            <div className="flex flex-col justify-center">
              <NoDataChart />
            </div>
          ) : (
            <>
              <div className="flex w-full aspect-square p-2 md:flex-1 md:w-auto">
                <DonutChart
                  data={DEBTS_BALANCE.data}
                  options={DEBTS_BALANCE.options}
                />
              </div>
              <button
                onClick={() => {
                  navigate(`/graph?graphCode=DEBTS_BALANCE`);
                }}
                className="bg-navy text-beige font-bold block m-auto rounded py-1 px-2 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Full Screen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
