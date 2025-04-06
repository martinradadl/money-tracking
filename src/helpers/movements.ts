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
    selectedDate?: string;
    selectedStartDate?: string;
    selectedEndDate?: string;
  };