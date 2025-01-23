import { Select } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DonutChart } from "@carbon/charts-react";
import { useGraphs } from "../../data/graphs";
import { useTransactions } from "../../data/transactions";
import { useDebts } from "../../data/debts";
import { useAuth } from "../../data/authentication";
import { useShallow } from "zustand/shallow";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const GraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const graphCode = searchParams.get("graphCode") || "";
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const navigate = useNavigate();
  const { mappedDataAndOptions } = useGraphs();
  const { data, options } = mappedDataAndOptions[graphCode];
  const { getTotalIncome, getTotalExpenses } = useTransactions();
  const { getTotalLoans, getTotalDebts } = useDebts();
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const getBalances = async () => {
    Promise.all([
      getTotalIncome(),
      getTotalExpenses(),
      getTotalLoans(),
      getTotalDebts(),
    ]);
  };

  useEffect(() => {
    if (!graphCode) {
      navigate("/not-found");
    }
  }, [graphCode]);

  useEffect(() => {
    if (user?._id) {
      getBalances();
    }
  }, [user?._id]);

  const handleChangeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event?.target.value);
  };

  return (
    <div className="px-3 py-3 overflow-auto flex flex-col gap-2">
      <div>
        <AiOutlineArrowLeft
          className="text-3xl text-beige cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        />
      </div>

      <Select
        name="month"
        id="month"
        value={selectedMonth}
        onChange={handleChangeMonth}
        className="w-full text-xl rounded bg-beige text-navy border-b-2"
      >
        {months.map((elem, i) => {
          return (
            <option key={i} value={elem}>
              {elem}
            </option>
          );
        })}
      </Select>
      <div className="bg-beige w-full aspect-square rounded p-6">
        <DonutChart {...{ data, options }} />
      </div>
    </div>
  );
};
