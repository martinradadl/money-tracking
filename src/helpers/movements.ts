export type getMovementsParams = {
  page?: number;
  limit?: number;
  timePeriod?: string;
  startDate?: string;
  endDate?: string;
  selectedDate?: string;
};

export type getAmountsSumParams = {
  timePeriod?: string;
  selectedDate?: string | null;
  selectedStartDate?: string | null;
  selectedEndDate?: string | null;
};

export const filterTypes = {
  singleDate: "Single Date",
  dateRange: "Date Range",
};

export type timePeriod = "Day" | "Month" | "Year";

export const timePeriods: { [key: string]: timePeriod } = {
  day: "Day",
  month: "Month",
  year: "Year",
};
