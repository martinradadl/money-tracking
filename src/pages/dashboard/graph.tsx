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
  GetAmountsSumParams,
  TimePeriod,
  timePeriods,
} from "../../helpers/movements";
import { useCookies } from "react-cookie";

export const GraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const graphCode = searchParams.get("graphCode") || "";
  const [selectedFilterType, setSelectedFilterType] = useState(
    filterTypes.singleDate
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>(
    timePeriods.day
  );
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
  const [, , removeCookie] = useCookies([
    "incomeCache",
    "expensesCache",
    "loansCache",
    "debtsCache",
  ]);

  const getBalances = async (params: GetAmountsSumParams) => {
    Promise.all([
      getTotalIncome(params),
      getTotalExpenses(params),
      getTotalLoans(params),
      getTotalDebts(params),
    ]);
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
    const params = {
      timePeriod: selectedTimePeriod.toLowerCase(),
      selectedDate: selectedDate
        ? formatDateByPeriod(selectedTimePeriod, selectedDate)
        : null,
      selectedStartDate: selectedDateRange[0]
        ? formatDateByPeriod(selectedTimePeriod, selectedDateRange[0])
        : null,
      selectedEndDate: selectedDateRange[1]
        ? formatDateByPeriod(selectedTimePeriod, selectedDateRange[1])
        : null,
    };
    if (user?._id) {
      removeCookie("incomeCache");
      removeCookie("expensesCache");
      removeCookie("loansCache");
      removeCookie("debtsCache");
      getBalances(params);
    }
  }, [selectedDate, selectedDateRange]);

  const formatDateByPeriod = (timePeriod: TimePeriod, date: Date) => {
    const formattedDates = {
      Year: date.toISOString().slice(0, 4),
      Month: date.toISOString().slice(0, 7),
      Day: date.toISOString().slice(0, 10),
    };
    return formattedDates[timePeriod];
  };

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
          showMonthYearPicker={selectedTimePeriod === timePeriods.months}
          showYearPicker={selectedTimePeriod === timePeriods.years}
          showYearDropdown={selectedTimePeriod === timePeriods.days}
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
          isClearable={selectedTimePeriod === timePeriods.days}
          showMonthYearPicker={selectedTimePeriod === timePeriods.months}
          showYearPicker={selectedTimePeriod === timePeriods.years}
          showYearDropdown={selectedTimePeriod === timePeriods.days}
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
