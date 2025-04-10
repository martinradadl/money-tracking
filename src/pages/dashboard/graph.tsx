import { Button, Select } from "@headlessui/react";
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
import {
  filterTypes,
  formatDateByPeriod,
  GetAmountsSumParams,
  TimePeriod,
  timePeriods,
} from "../../helpers/movements";
import { removeCookie } from "../../helpers/cookies";

export const GraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const graphCode = searchParams.get("graphCode") || "";
  const [selectedFilterType, setSelectedFilterType] = useState(
    filterTypes.singleDate
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods.day);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
  const getBalances = async (params: GetAmountsSumParams) => {
    Promise.all([
      getTotalIncome(params),
      getTotalExpenses(params),
      getTotalLoans(params),
      getTotalDebts(params),
    ]);
  };
  const getAmountsSumParams = () => {
    const selectedTimePeriodKey = selectedTimePeriod.toLowerCase();
    const params = {
      timePeriod: selectedTimePeriodKey,
      selectedDate: "",
      selectedStartDate: "",
      selectedEndDate: "",
    };
    if (selectedDate)
      params.selectedDate = formatDateByPeriod(
        selectedTimePeriodKey,
        selectedDate
      );
    else if (selectedDateRange[0] && selectedDateRange[1]) {
      params.selectedStartDate = formatDateByPeriod(
        selectedTimePeriodKey,
        selectedDateRange[0]
      );
      params.selectedStartDate = formatDateByPeriod(
        selectedTimePeriodKey,
        selectedDateRange[1]
      );
    } else {
      return {};
    }
    return params;
  };

  useEffect(() => {
    if (!graphCode) {
      navigate("/not-found");
    }
  }, [graphCode]);

  useEffect(() => {
    if (user?._id) {
      getBalances({});
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      if (
        graphCode === "TOTAL_BALANCE" ||
        graphCode === "TOTAL_BALANCE_DETAILED"
      ) {
        removeCookie("incomeCache");
        removeCookie("expensesCache");
        removeCookie("loansCache");
        removeCookie("debtsCache");
      } else if (graphCode === "DEBTS_BALANCE") {
        removeCookie("loansCache");
        removeCookie("debtsCache");
      } else if (graphCode === "TRANSACTIONS_BALANCE") {
        removeCookie("incomeCache");
        removeCookie("expensesCache");
      }
      getBalances(getAmountsSumParams());
    }
  }, [selectedDate, selectedDateRange]);

  const handleChangeFilterType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFilterType(event?.target.value);
    if (event?.target.value === filterTypes.singleDate) {
      setSelectedDateRange([null, null]);
    } else {
      setSelectedDate(null);
    }
  };

  const handleChangeTimePeriod = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTimePeriod(event?.target.value as TimePeriod);
  };

  const handleCleanFilter = () => {
    setSelectedDateRange([null, null]);
    setSelectedDate(null);
    setSelectedFilterType(filterTypes.singleDate);
    setSelectedTimePeriod(timePeriods.day);
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
        {Object.values(filterTypes).map((elem, i) => {
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
        {Object.values(timePeriods).map((elem, i) => {
          return (
            <option key={i} value={elem}>
              {elem}
            </option>
          );
        })}
      </Select>
      {selectedFilterType === filterTypes.singleDate ? (
        <DatePicker
          className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showIcon
          dateFormat={
            selectedTimePeriod === timePeriods.day
              ? undefined
              : selectedTimePeriod === timePeriods.month
              ? "MM/yyyy"
              : "yyyy"
          }
          showMonthYearPicker={selectedTimePeriod === timePeriods.month}
          showYearPicker={selectedTimePeriod === timePeriods.year}
          showYearDropdown={selectedTimePeriod === timePeriods.day}
        />
      ) : (
        <DatePicker
          className="w-full h-9 px-2 rounded border-navy bg-beige border-b-2"
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setSelectedDateRange(update);
          }}
          showIcon
          dateFormat={
            selectedTimePeriod === timePeriods.day
              ? undefined
              : selectedTimePeriod === timePeriods.month
              ? "MM/yyyy"
              : "yyyy"
          }
          isClearable={selectedTimePeriod === timePeriods.day}
          showMonthYearPicker={selectedTimePeriod === timePeriods.month}
          showYearPicker={selectedTimePeriod === timePeriods.year}
          showYearDropdown={selectedTimePeriod === timePeriods.day}
        />
      )}
      <Button
        className="w-full rounded-md bg-yellow-category text-navy py-1 px-3 text-xl font-semibold"
        onClick={handleCleanFilter}
      >
        Clear Filter
      </Button>
      <div className="bg-beige w-full aspect-square rounded p-6 mt-4">
        <DonutChart {...{ data, options }} />
      </div>
    </div>
  );
};
