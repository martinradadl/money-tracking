import { CategoryI } from "../data/categories";
import { NO_CATEGORY } from "./categories";

export type GetMovementsParams = {
  page?: number;
  limit?: number;
  timePeriod?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  category?: string;
};

export type GetAmountsSumParams = {
  timePeriod?: string;
  date?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export const filterTypes = {
  singleDate: "Single Date",
  dateRange: "Date Range",
};

export type TimePeriod = "Day" | "Month" | "Year";
export type TimePeriodObject = { [key in string]: TimePeriod };

export const timePeriods: TimePeriodObject = {
  day: "Day",
  month: "Month",
  year: "Year",
};

export const formatDateByPeriod = (timePeriod: string, date: Date) => {
  const formattedDates = {
    year: date.toISOString().slice(0, 4),
    month: date.toISOString().slice(0, 7),
    day: date.toISOString().slice(0, 10),
  };
  return formattedDates[timePeriod as "year" | "month" | "day"];
};

export type FilterMovementForm = {
  type: string;
  timePeriod: string;
  date: Date | null;
  dateRange: (Date | null)[];
  category: CategoryI;
};

export const filterFormInitialState: FilterMovementForm = {
  type: filterTypes.singleDate,
  timePeriod: "",
  date: null,
  dateRange: [null, null],
  category: NO_CATEGORY,
};

export const splitDate = (fullDate: string) => {
  const splittedDate = fullDate.split("T");
  const date = splittedDate[0];
  const hour = splittedDate[1].slice(0, 5);
  return { date, hour };
};
