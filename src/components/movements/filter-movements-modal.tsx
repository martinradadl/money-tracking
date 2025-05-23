import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Select,
} from "@headlessui/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  filterFormInitialState,
  FilterMovementForm,
  filterTypes,
  formatDateByPeriod,
  GetMovementsParams,
  timePeriods,
} from "../../helpers/movements";
import DatePicker from "react-datepicker";
import { getTransactions } from "../../data/transactions";
import { getDebts } from "../../data/debts";
import { useCategories } from "../../data/categories";
import { useShallow } from "zustand/shallow";
import { MdCancel, MdOutlineExpandMore, MdClose } from "react-icons/md";
import { NO_CATEGORY } from "../../helpers/categories";
import { useState } from "react";

interface props {
  close: () => void;
  isOpen: boolean;
  filters: FilterMovementForm;
  setFilters: React.Dispatch<React.SetStateAction<FilterMovementForm>>;
  isFilterActive: boolean;
  setIsFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
  isDebts?: boolean;
}

export const FilterMovementsModal = ({
  close,
  isOpen,
  filters,
  setFilters,
  setIsFilterActive,
  isDebts,
}: props) => {
  const [startDate, endDate] = filters.dateRange;
  const { categories } = useCategories(
    useShallow((state) => ({
      categories: state.categories,
    }))
  );
  const [isDateFormOpen, setIsDateFormOpen] = useState(false);

  const handleChangeFilterType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const dateKey =
      event.target.value === filterTypes.singleDate ? "date" : "dateRange";
    const dateNewValue =
      event.target.value === filterTypes.singleDate
        ? filterFormInitialState.date
        : filterFormInitialState.dateRange;
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
      [dateKey]: dateNewValue,
    });
  };

  const handleChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeDate = (
    date: Date | null | (Date | null)[],
    isSingleDate: boolean
  ) => {
    const key = isSingleDate ? "date" : "dateRange";
    setFilters({
      ...filters,
      [key]: date,
    });
  };

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      category: { _id: event.target.value, label: "" },
    });
  };

  const handleOpenFiltersByDate = () => {
    setFilters({
      ...filters,
      type: filterTypes.singleDate,
      timePeriod: timePeriods.day,
    });
    setIsDateFormOpen(true);
  };

  const handleCloseFiltersByDate = () => {
    setIsDateFormOpen(false);
    setFilters({
      ...filters,
      type: filterFormInitialState.type,
      timePeriod: filterFormInitialState.timePeriod,
      date: filterFormInitialState.date,
      dateRange: filterFormInitialState.dateRange,
    });
  };

  const handleSubmit = async () => {
    const { timePeriod, date, dateRange, category } = filters;
    if (
      date === filterFormInitialState.date &&
      dateRange === filterFormInitialState.dateRange &&
      category === filterFormInitialState.category
    ) {
      setIsFilterActive(false);
      if (isDebts) {
        await getDebts({ page: 1, limit: 10 }, true);
      } else {
        await getTransactions({ page: 1, limit: 10 }, true);
      }
    } else {
      setIsFilterActive(true);
      const params: GetMovementsParams = {
        timePeriod: undefined,
        date: "",
        startDate: "",
        endDate: "",
        category: "",
        page: 1,
        limit: 10,
      };

      if ((date || dateRange?.every(Boolean)) && timePeriod) {
        params.timePeriod = timePeriod;
        params.date = date ? formatDateByPeriod(timePeriod, date) : undefined;
        params.startDate =
          dateRange && dateRange[0]
            ? formatDateByPeriod(timePeriod, dateRange[0])
            : undefined;
        params.endDate =
          dateRange && dateRange[1] && timePeriod
            ? formatDateByPeriod(timePeriod, dateRange[1])
            : undefined;
      }

      if (category) params.category = category._id;
      if (isDebts) {
        await getDebts(params, true);
      } else {
        await getTransactions(params, true);
      }
    }
    close();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-dvh">
          <div className="flex min-h-full items-center justify-center text-navy">
            <DialogPanel
              transition
              className="w-full flex flex-col place-content-between h-screen overflow-scroll bg-green font-semibold py-4 px-5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="overflow-auto">
                <AiOutlineArrowLeft
                  className="text-3xl my-2"
                  onClick={() => {
                    setFilters(filterFormInitialState);
                    setIsDateFormOpen(false);
                    close();
                  }}
                />

                <DialogTitle className="text-3xl py-2">
                  {`Filter ${isDebts ? "Debts" : "Transactions"}`}
                </DialogTitle>

                <div className="flex flex-col gap-4 mt-2">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      if (isDateFormOpen) {
                        handleCloseFiltersByDate();
                      } else {
                        handleOpenFiltersByDate();
                      }
                    }}
                  >
                    <p className="text-2xl flex-1">Filter by Date</p>
                    {isDateFormOpen ? (
                      <MdClose className="text-3xl font-bold" />
                    ) : (
                      <MdOutlineExpandMore className="text-3xl font-bold" />
                    )}
                  </div>
                  {isDateFormOpen ? (
                    <>
                      <label>
                        <p className="text-xl mb-2">Type</p>
                        <Select
                          name="type"
                          id="type"
                          value={filters.type}
                          onChange={handleChangeFilterType}
                          className="w-full h-9 border-navy rounded bg-green border-b-2"
                        >
                          {Object.values(filterTypes).map((elem, i) => {
                            return (
                              <option key={i} value={elem}>
                                {elem}
                              </option>
                            );
                          })}
                        </Select>
                      </label>

                      <label>
                        <p className="text-xl mb-2">Time Period</p>
                        <Select
                          name="timePeriod"
                          id="timePeriod"
                          value={filters.timePeriod}
                          onChange={handleChangeFilter}
                          className="w-full h-9 border-navy rounded bg-green border-b-2 capitalize"
                        >
                          {Object.values(timePeriods).map((elem, i) => {
                            return (
                              <option key={i} value={elem}>
                                {elem}
                              </option>
                            );
                          })}
                        </Select>
                      </label>

                      <label>
                        <p className="capitalize text-xl mb-2">date</p>
                        {filters.type === filterTypes.singleDate ? (
                          <DatePicker
                            className="w-full h-9 px-2 border-navy bg-green text-navy border-b-2"
                            selected={filters.date}
                            onChange={(date) => {
                              handleChangeDate(date, true);
                            }}
                            dateFormat={
                              filters.timePeriod === timePeriods.day
                                ? undefined
                                : filters.timePeriod === timePeriods.month
                                ? "MM/yyyy"
                                : "yyyy"
                            }
                            showMonthYearPicker={
                              filters.timePeriod === timePeriods.month
                            }
                            showYearPicker={
                              filters.timePeriod === timePeriods.year
                            }
                            showYearDropdown={
                              filters.timePeriod === timePeriods.day
                            }
                            isClearable
                          />
                        ) : (
                          <DatePicker
                            className="w-full h-9 px-2 border-navy bg-green text-navy border-b-2"
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                              handleChangeDate(update, false);
                            }}
                            dateFormat={
                              filters.timePeriod === timePeriods.day
                                ? undefined
                                : filters.timePeriod === timePeriods.month
                                ? "MM/yyyy"
                                : "yyyy"
                            }
                            showMonthYearPicker={
                              filters.timePeriod === timePeriods.month
                            }
                            showYearPicker={
                              filters.timePeriod === timePeriods.year
                            }
                            showYearDropdown={
                              filters.timePeriod === timePeriods.day
                            }
                            isClearable
                          />
                        )}
                      </label>
                    </>
                  ) : null}

                  <p className="text-2xl">Filter by Category</p>
                  <label>
                    <div className="flex items-center gap-1">
                      <Select
                        name="category"
                        id="category"
                        value={filters.category._id}
                        onChange={handleChangeCategory}
                        className="w-full h-9 border-navy rounded bg-green border-b-2 flex-1"
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
                          className="text-2xl"
                          onClick={() => {
                            setFilters({
                              ...filters,
                              category: NO_CATEGORY,
                            });
                          }}
                        />
                      ) : null}
                    </div>
                  </label>
                </div>
              </div>
              <div className="mt-auto pt-4 bg-green">
                <Button
                  className="w-full rounded-md bg-navy text-beige py-1.5 px-3 text-2xl font-semibold"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
