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
  filterFormInitialState,
  FilterMovementForm,
  filterTypes,
  formatDateByPeriod,
  GetAmountsSumParams,
  TimePeriod,
  timePeriods,
} from "../../helpers/movements";
import { removeCookie } from "../../helpers/cookies";
import { NoDataChart } from "../../components/no-data-chart";
import { useCategories } from "../../data/categories";
import { MdCancel } from "react-icons/md";
import { NO_CATEGORY } from "../../helpers/categories";

export const GraphPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const graphCode = searchParams.get("graphCode") || "";
  const [filters, setFilters] = useState<FilterMovementForm>(
    filterFormInitialState
  );
  const { timePeriod, date, dateRange, category, type } = filters;
  const [startDate, endDate] = dateRange;
  const navigate = useNavigate();
  const { mappedDataAndOptions } = useGraphs();
  const { data, options } = mappedDataAndOptions[graphCode];
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );
  const { categories } = useCategories(
    useShallow((state) => ({
      categories: state.categories,
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
    if (!date && !dateRange[0] && !dateRange[1] && category === NO_CATEGORY) {
      return {};
    }
    const params = {
      timePeriod: undefined,
      date: "",
      startDate: "",
      endDate: "",
      category: category._id,
    };
    if ((date || dateRange?.every(Boolean)) && timePeriod)
      if (date) params.date = formatDateByPeriod(timePeriod, date);
      else if (dateRange[0] && dateRange[1]) {
        params.startDate = formatDateByPeriod(timePeriod, dateRange[0]);
        params.endDate = formatDateByPeriod(timePeriod, dateRange[1]);
      }
    return params;
  };

  const timePeriodsFormats = { day: undefined, month: "MM/yyyy", year: "yyyy" };

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
      const params = getAmountsSumParams();
      getBalances(params);
    }
  }, [date, dateRange, category]);

  const handleChangeFilterType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event?.target.value === filterTypes.singleDate) {
      setFilters({
        ...filters,
        dateRange: filterFormInitialState.dateRange,
      });
    } else {
      setFilters({
        ...filters,
        date: filterFormInitialState.date,
      });
    }
    setFilters({ ...filters, type: event?.target.value });
  };

  const handleChangeTimePeriod = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilters({ ...filters, timePeriod: event?.target.value as TimePeriod });
  };

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      category: { _id: event.target.value, label: "" },
    });
  };

  return (
    <div className="px-3 py-3 overflow-auto flex flex-col gap-2">
      <div>
        <AiOutlineArrowLeft
          className="text-3xl text-beige cursor-pointer"
          onClick={() => {
            setFilters(filterFormInitialState);
            navigate(-1);
          }}
        />
      </div>

      <h1 className="text-2xl text-beige">Filter by Date:</h1>
      <Select
        name="filter-type"
        id="filter-type"
        value={type}
        onChange={handleChangeFilterType}
        className="w-full text-xl rounded bg-navy text-beige border-b-2"
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
        value={timePeriod}
        onChange={handleChangeTimePeriod}
        className="w-full text-xl rounded bg-navy text-beige border-b-2 capitalize"
      >
        {Object.values(timePeriods).map((elem, i) => {
          return (
            <option key={i} value={elem}>
              {elem}
            </option>
          );
        })}
      </Select>
      {type === filterTypes.singleDate ? (
        <DatePicker
          className="w-full h-9 px-2 rounded border-beige bg-navy text-beige border-b-2"
          placeholderText="Select a Date"
          selected={date}
          onChange={(date) => {
            setFilters({ ...filters, date });
          }}
          dateFormat={timePeriodsFormats[timePeriod as TimePeriod]}
          showMonthYearPicker={timePeriod === timePeriods.month}
          showYearPicker={timePeriod === timePeriods.year}
          showYearDropdown={timePeriod === timePeriods.day}
          isClearable
        />
      ) : (
        <DatePicker
          className="w-full h-9 px-2 rounded border-beige bg-navy text-beige border-b-2"
          placeholderText="Select a Date"
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(dateRange) => setFilters({ ...filters, dateRange })}
          dateFormat={timePeriodsFormats[timePeriod as TimePeriod]}
          isClearable
          showMonthYearPicker={timePeriod === timePeriods.month}
          showYearPicker={timePeriod === timePeriods.year}
          showYearDropdown={timePeriod === timePeriods.day}
        />
      )}
      <h1 className="text-2xl text-beige">Filter by Category:</h1>
      <div className="flex items-center gap-1">
        <Select
          name="category"
          id="category"
          value={category._id}
          onChange={handleChangeCategory}
          className="w-full text-xl rounded bg-navy text-beige border-b-2"
        >
          <option style={{ display: "none" }}></option>
          {categories.map((elem, i) => {
            return (
              <option key={i} value={elem._id}>
                {elem.label}
              </option>
            );
          })}
        </Select>
        {filters.category._id !== "" ? (
          <MdCancel
            className="text-2xl text-beige"
            onClick={() => {
              setFilters({
                ...filters,
                category: NO_CATEGORY,
              });
            }}
          />
        ) : null}
      </div>

      <Button
        className="w-full rounded-md bg-yellow-category text-navy py-1 px-3 text-xl font-semibold"
        onClick={() => {
          setFilters(filterFormInitialState);
        }}
      >
        Clear Filter
      </Button>
      {data.every((elem) => elem.value === 0) ? (
        <NoDataChart />
      ) : (
        <div className="bg-beige w-full aspect-square rounded p-6 mt-4">
          <DonutChart {...{ data, options }} />
        </div>
      )}
    </div>
  );
};
