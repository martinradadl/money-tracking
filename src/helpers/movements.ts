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

export const timePeriods: { [key: string]: TimePeriod } = {
  day: "Day",
  month: "Month",
  year: "Year",
};
