export type GetMovementsParams = {
  page?: number;
  limit?: number;
  timePeriod?: string;
  startDate?: string;
  endDate?: string;
  selectedDate?: string;
};

export type GetAmountsSumParams = {
  timePeriod?: string;
  selectedDate?: string | null;
  selectedStartDate?: string | null;
  selectedEndDate?: string | null;
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
};

export const filterFormInitialState: FilterMovementForm = {
  type: filterTypes.singleDate,
  timePeriod: timePeriods.day,
  date: null,
  dateRange: [null, null],
};

export const splitDate = (fullDate: string) => {
  const splittedDate = fullDate.split("T");
  const date = splittedDate[0];
  const hour = splittedDate[1].slice(0, 5);
  return { date, hour };
};
