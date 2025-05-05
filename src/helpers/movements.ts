import { CategoryI } from "../data/categories";
import { DebtType } from "../data/debts";
import { TransactionType } from "../data/transactions";
import { NO_CATEGORY } from "./categories";

export type GetMovementsParams = {
  page?: number;
  limit?: number;
  timePeriod?: TimePeriod;
  startDate?: string;
  endDate?: string;
  date?: string;
  category?: string;
  isTotalBalance?: boolean;
};

export type GetAmountsSumParams = {
  timePeriod?: TimePeriod;
  date?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type MovementChartDataI = {
  group: TransactionType | DebtType | "Transaction" | "Debt";
  amount: number;
  date: string;
};

export const filterTypes = {
  singleDate: "Single Date",
  dateRange: "Date Range",
};

export type TimePeriod = "day" | "month" | "year";
export type TimePeriodObject = { [key in string]: TimePeriod };

export const timePeriods: TimePeriodObject = {
  day: "day",
  month: "month",
  year: "year",
};

export const formatDateByPeriod = (timePeriod: TimePeriod, date: Date) => {
  const formattedDates = {
    year: date.toISOString().slice(0, 4),
    month: date.toISOString().slice(0, 7),
    day: date.toISOString().slice(0, 10),
  };
  return formattedDates[timePeriod];
};

export type FilterMovementForm = {
  type: string;
  timePeriod: TimePeriod | "";
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
