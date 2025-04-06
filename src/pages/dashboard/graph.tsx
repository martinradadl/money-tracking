import { Select } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DonutChart } from "@carbon/charts-react";
import { useGraphs } from "../../data/graphs";
import { getTotalIncome, getTotalExpenses } from "../../data/transactions";
import { getTotalLoans, getTotalDebts } from "../../data/debts";
import { useAuth } from "../../data/authentication";
import { useShallow } from "zustand/shallow";
import DatePicker from "react-datepicker";

export const GraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const graphCode = searchParams.get("graphCode") || "";
  const [selectedFilterType, setSelectedFilterType] = useState("Single Date");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Day");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState<(Date | null)[]>([
    null,
    null,
  ]);
  const [startDate, endDate] = selectedDateRange;
  const navigate = useNavigate();
  const { mappedDataAndOptions } = useGraphs();
  const { data, options } = mappedDataAndOptions[graphCode];
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const getBalances = async () => {
    Promise.all([
      getTotalIncome({}),
      getTotalExpenses({}),
      getTotalLoans({}),
      getTotalDebts({}),
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

  const handleChangeFilterType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFilterType(event?.target.value);
  };

  const handleChangeTimePeriod = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTimePeriod(event?.target.value);
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

      <h1 className="text-2xl text-beige">Filter by:</h1>
      <Select
        name="filter-type"
        id="filter-type"
        value={selectedFilterType}
        onChange={handleChangeFilterType}
        className="w-full text-xl rounded bg-beige text-navy border-b-2"
      >
        {["Single Date", "Date Range"].map((elem, i) => {
          return (
            <option key={i} value={elem}>
              {elem}
            </option>
          );
        })}
      </Select>
      <Select
        name="time-period"
        id="time-period"
        value={selectedTimePeriod}
        onChange={handleChangeTimePeriod}
        className="w-full text-xl rounded bg-beige text-navy border-b-2"
      >
        {["Day", "Month", "Year"].map((elem, i) => {
          return (
            <option key={i} value={elem}>
              {elem}
            </option>
          );
        })}
      </Select>
      {selectedFilterType === "Single Date" ? (
        selectedTimePeriod === "Day" ? (
          <DatePicker
            className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
            showIcon
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        ) : selectedTimePeriod === "Month" ? (
          <DatePicker
            className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        ) : (
          <DatePicker
            className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showYearPicker
            dateFormat="yyyy"
          />
        )
      ) : selectedTimePeriod === "Day" ? (
        <DatePicker
          className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setSelectedDateRange(update);
          }}
          isClearable={true}
        />
      ) : selectedTimePeriod === "Month" ? (
        <DatePicker
          className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
          selected={startDate}
          onChange={(update) => {
            setSelectedDateRange(update);
          }}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
      ) : (
        <DatePicker
          className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
          selected={startDate}
          onChange={(update) => {
            setSelectedDateRange(update);
          }}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy"
          showYearPicker
        />
      )}
      <div className="bg-beige w-full aspect-square rounded p-6 mt-4">
        <DonutChart {...{ data, options }} />
      </div>
    </div>
  );
};
