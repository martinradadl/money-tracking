import React, { useEffect, useState } from "react";
import { useAuth } from "../../data/authentication";
import {
  getTotalIncome,
  getTotalExpenses,
  getTransactionsChartData,
} from "../../data/transactions";
import {
  getTotalLoans,
  getTotalDebts,
  getDebtsChartData,
} from "../../data/debts";
import { useNavigate } from "react-router-dom";
import { DonutChart, StackedBarChart } from "@carbon/charts-react";
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

  const [barChartWidth, setBarChartWidth] = useState(window.innerWidth);
  const {
    donutChartMappedDataAndOptions,
    stackedBarChartMappedDataAndOptions,
  } = useGraphs();

  const {
    TOTAL_BALANCE: DONUT_TOTAL_BALANCE,
    TOTAL_BALANCE_DETAILED: DONUT_TOTAL_BALANCE_DETAILED,
    DEBTS_BALANCE: DONUT_DEBTS_BALANCE,
    TRANSACTIONS_BALANCE: DONUT_TRANSACTIONS_BALANCE,
  } = donutChartMappedDataAndOptions;

  const {
    TOTAL_BALANCE: STACKED_BAR_TOTAL_BALANCE,
    TOTAL_BALANCE_DETAILED: STACKED_BAR_TOTAL_BALANCE_DETAILED,
    DEBTS_BALANCE: STACKED_BAR_DEBTS_BALANCE,
    TRANSACTIONS_BALANCE: STACKED_BAR_TRANSACTIONS_BALANCE,
  } = stackedBarChartMappedDataAndOptions;

  const getBalances = async () => {
    Promise.all([
      getTotalIncome({}),
      getTotalExpenses({}),
      getTotalLoans({}),
      getTotalDebts({}),
    ]);
  };

  const getChartDataLists = async () => {
    Promise.all([
      getTransactionsChartData({}),
      getDebtsChartData({}),
      getTransactionsChartData({ isTotalBalance: true }),
      getDebtsChartData({ isTotalBalance: true }),
    ]);
  };

  useEffect(() => {
    if (user?._id) {
      getBalances();
      getChartDataLists();
    }
  }, [user?._id]);

  useEffect(() => {
    addEventListener("resize", () => {
      setBarChartWidth(window.innerWidth);
    });
    return () => {
      removeEventListener("resize", () => {
        setBarChartWidth(window.innerWidth);
      });
    };
  }, []);

  return (
    <div className="flex flex-col w-full items-center overflow-y-auto">
      <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-4 entrance-anim max-md:block	 md:w-4/5 max-w-[1000px]">
        <h1 className="page-title text-beige">Hi, {user?.name}</h1>
        <h2 className="text-beige text-2xl font-semibold">Your Balances: </h2>
        <div className="bg-beige rounded p-2 flex flex-wrap gap-4 mb-4">
          <div className="w-full flex flex-col md:flex-1 pb-2">
            <h3 className="text-navy text-xl font-semibold text-center">
              Total Balance{" "}
            </h3>
            {DONUT_TOTAL_BALANCE.data[0].value === 0 &&
            DONUT_TOTAL_BALANCE.data[1].value === 0 ? (
              <div className="flex flex-col justify-center">
                <NoDataChart />
              </div>
            ) : (
              <div className="w-full md:flex-1 pb-2">
                <div className="flex w-full aspect-square p-2 max-md:flex-1 md:w-auto">
                  <DonutChart
                    data={DONUT_TOTAL_BALANCE.data}
                    options={DONUT_TOTAL_BALANCE.options}
                  />
                </div>
                <div
                  className="flex w-full p-2 md:flex-1 md:w-auto"
                  style={{ maxWidth: barChartWidth - 40 }}
                >
                  <StackedBarChart
                    {...{
                      data: STACKED_BAR_TOTAL_BALANCE.data,
                      options: STACKED_BAR_TOTAL_BALANCE.options,
                    }}
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
          <div className="w-full flex flex-col md:flex-1 pb-2">
            <h3 className="text-navy text-xl font-semibold text-center">
              Detailed Balance
            </h3>
            {DONUT_TOTAL_BALANCE_DETAILED.data[0].value === 0 &&
            DONUT_TOTAL_BALANCE_DETAILED.data[1].value === 0 ? (
              <div className="flex flex-col justify-center">
                <NoDataChart />
              </div>
            ) : (
              <div className="w-full md:flex-1 pb-2">
                <div className="flex w-full aspect-square p-2 max-md:flex-1 md:w-auto">
                  <DonutChart
                    data={DONUT_TOTAL_BALANCE_DETAILED.data}
                    options={DONUT_TOTAL_BALANCE_DETAILED.options}
                  />
                </div>
                <div
                  className="flex w-full p-2 md:flex-1 md:w-auto"
                  style={{ maxWidth: barChartWidth - 40 }}
                >
                  <StackedBarChart
                    {...{
                      data: STACKED_BAR_TOTAL_BALANCE_DETAILED.data,
                      options: STACKED_BAR_TOTAL_BALANCE_DETAILED.options,
                    }}
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
        <div className="bg-beige rounded p-2 flex flex-wrap gap-4">
          <div className="w-full flex flex-col md:flex-1 pb-2">
            <h3 className="text-navy text-xl font-semibold text-center">
              Transactions{" "}
            </h3>

            {DONUT_TRANSACTIONS_BALANCE.data[0].value === 0 &&
            DONUT_TRANSACTIONS_BALANCE.data[1].value === 0 ? (
              <div className="flex flex-col justify-center">
                <NoDataChart />
              </div>
            ) : (
              <>
                <div className="flex w-full aspect-square p-2 md:flex-1 md:w-auto">
                  <DonutChart
                    data={DONUT_TRANSACTIONS_BALANCE.data}
                    options={DONUT_TRANSACTIONS_BALANCE.options}
                  />
                </div>
                <div
                  className="flex w-full p-2 md:flex-1 md:w-auto"
                  style={{ maxWidth: barChartWidth - 40 }}
                >
                  <StackedBarChart
                    {...{
                      data: STACKED_BAR_TRANSACTIONS_BALANCE.data,
                      options: STACKED_BAR_TRANSACTIONS_BALANCE.options,
                    }}
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
          <div className="w-full flex flex-col md:flex-1 pb-2">
            <h3 className="text-navy text-xl font-semibold text-center">
              Debts{" "}
            </h3>
            {DONUT_DEBTS_BALANCE.data[0].value === 0 &&
            DONUT_DEBTS_BALANCE.data[1].value === 0 ? (
              <div className="flex flex-col justify-center">
                <NoDataChart />
              </div>
            ) : (
              <>
                <div className="flex w-full aspect-square p-2 md:flex-1 md:w-auto">
                  <DonutChart
                    data={DONUT_DEBTS_BALANCE.data}
                    options={DONUT_DEBTS_BALANCE.options}
                  />
                </div>
                <div
                  className="flex w-full p-2 md:flex-1 md:w-auto"
                  style={{ maxWidth: barChartWidth - 40 }}
                >
                  <StackedBarChart
                    {...{
                      data: STACKED_BAR_DEBTS_BALANCE.data,
                      options: STACKED_BAR_DEBTS_BALANCE.options,
                    }}
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
    </div>
  );
};
