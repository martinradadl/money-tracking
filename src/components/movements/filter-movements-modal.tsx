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
  timePeriods,
} from "../../helpers/movements";
import DatePicker from "react-datepicker";

interface props {
  close: () => void;
  isOpen: boolean;
  selectedFilters: FilterMovementForm;
  setSelectedFilters: React.Dispatch<React.SetStateAction<FilterMovementForm>>;
  isFilterActive: boolean;
  setIsFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
  isDebts?: boolean;
}

export const FilterMovementsModal = ({
  close,
  isOpen,
  selectedFilters,
  setSelectedFilters,
  setIsFilterActive,
  isDebts,
}: props) => {
  const [startDate, endDate] = selectedFilters.dateRange;

  const handleChangeFilterType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const dateKey =
      event.target.value === filterTypes.singleDate ? "date" : "dateRange";
    const dateNewValue =
      event.target.value === filterTypes.singleDate
        ? filterFormInitialState.date
        : filterFormInitialState.dateRange;
    setSelectedFilters({
      ...selectedFilters,
      [event.target.name]: event.target.value,
      [dateKey]: dateNewValue,
    });
  };

  const handleChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilters({
      ...selectedFilters,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeDate = (
    date: Date | null | (Date | null)[],
    isSingleDate: boolean
  ) => {
    const key = isSingleDate ? "date" : "dateRange";
    setSelectedFilters({
      ...selectedFilters,
      [key]: date,
    });
  };

  const handleSubmit = () => {
    if (
      selectedFilters.date === filterFormInitialState.date &&
      selectedFilters.dateRange === filterFormInitialState.dateRange
    ) {
      setIsFilterActive(false);
    } else {
      setIsFilterActive(true);
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
                <AiOutlineArrowLeft className="text-3xl my-2" onClick={close} />

                <DialogTitle className="text-3xl py-2">
                  {`Filter ${isDebts ? "Debts" : "Transactions"}`}
                </DialogTitle>

                <div className="flex flex-col gap-4 mt-2">
                  <label>
                    <p className="text-2xl mb-2">Type</p>
                    <Select
                      name="type"
                      id="type"
                      value={selectedFilters.type}
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
                    <p className="text-2xl mb-2">Time Period</p>
                    <Select
                      name="timePeriod"
                      id="timePeriod"
                      value={selectedFilters.timePeriod}
                      onChange={handleChangeFilter}
                      className="w-full h-9 border-navy rounded bg-green border-b-2"
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
                    <p className="capitalize text-2xl mb-2">date</p>
                    {selectedFilters.type === filterTypes.singleDate ? (
                      <DatePicker
                        className="w-full h-9 px-2 border-navy bg-green text-navy border-b-2"
                        selected={selectedFilters.date}
                        onChange={(date) => {
                          handleChangeDate(date, true);
                        }}
                        dateFormat={
                          selectedFilters.timePeriod === timePeriods.day
                            ? undefined
                            : selectedFilters.timePeriod === timePeriods.month
                            ? "MM/yyyy"
                            : "yyyy"
                        }
                        showMonthYearPicker={
                          selectedFilters.timePeriod === timePeriods.month
                        }
                        showYearPicker={
                          selectedFilters.timePeriod === timePeriods.year
                        }
                        showYearDropdown={
                          selectedFilters.timePeriod === timePeriods.day
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
                          selectedFilters.timePeriod === timePeriods.day
                            ? undefined
                            : selectedFilters.timePeriod === timePeriods.month
                            ? "MM/yyyy"
                            : "yyyy"
                        }
                        showMonthYearPicker={
                          selectedFilters.timePeriod === timePeriods.month
                        }
                        showYearPicker={
                          selectedFilters.timePeriod === timePeriods.year
                        }
                        showYearDropdown={
                          selectedFilters.timePeriod === timePeriods.day
                        }
                        isClearable
                      />
                    )}
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
