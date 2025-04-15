import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DebtFormI,
  DebtI,
  deleteDebt,
  getDebts,
  getTotalDebts,
  getTotalLoans,
  newDebtInitialState,
  nextPage,
  setIsInitialLoad,
  setNewDebt,
  setSelectedDebt,
  useDebts,
} from "../../data/debts";
import { useAuth } from "../../data/authentication";
import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { AiFillEdit } from "react-icons/ai";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { Card } from "../../components/movements/card";
import { DeleteMovementModal } from "../../components/movements/delete-movement";
import { DebtModal } from "./debt-modal";
import { isMobile } from "../../helpers/utils";
import { getCurrencyFormat } from "../../helpers/currency";
import { CardSkeleton } from "../../components/movements/card-skeleton";
import { LoadingIcon } from "../../components/loading-icon";
import { useShallow } from "zustand/shallow";
import debounce from "lodash.debounce";
import { FilterMovementsModal } from "../../components/movements/filter-movements-modal";
import {
  filterFormInitialState,
  FilterMovementForm,
} from "../../helpers/movements";

export const Debts: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const {
    debtsList,
    selectedDebt,
    isLastPage,
    totalLoans,
    totalDebts,
    page,
    isInitialLoad,
  } = useDebts(
    useShallow((state) => ({
      debtsList: state.debtsList,
      selectedDebt: state.selectedDebt,
      isLastPage: state.isLastPage,
      totalLoans: state.totalLoans,
      totalDebts: state.totalDebts,
      page: state.page,
      isInitialLoad: state.isInitialLoad,
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterMovementForm>(
    filterFormInitialState
  );
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const selectedContainer = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedDebt(null);
    }, 200);
    setNewDebt(newDebtInitialState);
  }

  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) {
      getTotalLoans({});
      getTotalDebts({});
    }
  }, [user?._id]);

  const balance = useMemo(() => {
    return totalLoans - totalDebts;
  }, [totalLoans, totalDebts]);

  const fetchDebts = async () => {
    if (user?._id) {
      await getDebts({ page, limit: 10 });
    }
  };

  const debouncedFetchDebts = debounce(fetchDebts, 200);

  useEffect(() => {
    if (isInitialLoadRef.current && isInitialLoad && user?._id) {
      isInitialLoadRef.current = false;
      getDebts({ page: 1, limit: 10 }).then(() => {
        setIsInitialLoad(false);
      });
    }
  }, [user, isInitialLoad]);

  useEffect(() => {
    if (loading === true && !isLastPage) {
      nextPage();
    }
    setLoading(false);
  }, [loading, isLastPage]);

  useEffect(() => {
    if (page > 1 && user?._id && !isLastPage) debouncedFetchDebts();
  }, [page, user?._id, isLastPage]);

  const handleScroll = () => {
    const subtraction =
      (container.current?.scrollHeight || 0) -
      (container.current?.offsetHeight || 0);

    if (subtraction - (container.current?.scrollTop || 0) < 5 && !loading) {
      setLoading(true);
    }
  };

  const handleClickedOutside = (event: Event) => {
    if (
      selectedContainer.current &&
      !selectedContainer.current.contains(event.target as Node) &&
      !isModalOpen
    ) {
      setSelectedDebt(null);
    }
  };

  const handleClickedOutsideWeb = (event: Event) => {
    if (
      selectedContainer.current &&
      !selectedContainer.current.contains(event.target as Node) &&
      !isModalOpen
    ) {
      setSelectedDebt(null);
    }
    document.removeEventListener("mousedown", handleClickedOutsideWeb, true);
  };

  const handleClick = (debt: DebtI) => {
    document.addEventListener("mousedown", handleClickedOutsideWeb, true);
    setSelectedDebt(debt as unknown as DebtFormI);
  };

  const handleTouchStart = (debt: DebtI) => {
    timer.current = setTimeout(() => {
      document.addEventListener("touchstart", handleClickedOutside, {
        once: true,
      });
      setSelectedDebt(debt as unknown as DebtFormI);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(timer.current);
  };

  return (
    <div
      className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-4 overflow-y-auto entrance-anim"
      onScroll={handleScroll}
      ref={container}
    >
      <h1 className="page-title text-beige">Debts</h1>
      <div className="flex place-content-between items-center">
        <div className="flex w-full gap-3 py-1 text-xl font-semibold">
          <p className="text-beige">My Balance:</p>
          <p
            className={classNames(
              balance >= 0
                ? "bg-green-pastel text-navy"
                : "bg-red-pastel text-beige",
              "rounded px-2 py-0.5 font-semibold"
            )}
          >
            {user
              ? getCurrencyFormat({ amount: balance, currency: user.currency })
              : null}
          </p>
        </div>
        <div className="flex gap-3">
          <MdFilterList
            className="text-4xl text-navy p-1 mr-1 bg-beige justify-center rounded-full cursor-pointer"
            onClick={() => {
              setIsFilterModalOpen(true);
            }}
          />
          {isFilterActive ? (
            <MdFilterListOff
              className="text-4xl text-navy p-1 mr-1 bg-red-pastel justify-center rounded-full cursor-pointer"
              onClick={async () => {
                setIsFilterActive(false);
                setSelectedFilters(filterFormInitialState);
                await getDebts({});
              }}
            />
          ) : null}
          <FilterMovementsModal
            {...{
              close: () => {
                setIsFilterModalOpen(false);
              },
              isOpen: isFilterModalOpen,
              selectedFilters,
              setSelectedFilters,
              isFilterActive,
              setIsFilterActive,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {isInitialLoad ? (
          <>
            <CardSkeleton />
            <CardSkeleton isIncomeOrLoan={true} />
            <CardSkeleton />
          </>
        ) : (
          debtsList.map((elem, i) => {
            return (
              <div key={i} className="relative">
                <Transition show={selectedDebt?._id === elem._id}>
                  <div
                    ref={selectedContainer}
                    className={classNames(
                      "absolute -top-4 flex gap-3 transition duration-300 ease-in data-[closed]:opacity-0",
                      elem.type === "loan" ? "right-1" : "right-5"
                    )}
                  >
                    <div
                      onClick={() => {
                        openModal();
                      }}
                      className="bg-beige text-navy rounded-full p-[0.4rem] text-2xl cursor-pointer"
                    >
                      <AiFillEdit />
                    </div>
                    <div className="bg-beige text-red rounded-full p-[0.4rem] text-2xl cursor-pointer">
                      <DeleteMovementModal<DebtFormI>
                        selectedMovement={selectedDebt}
                        {...{
                          setSelectedMovement: setSelectedDebt,
                          deleteMovement: deleteDebt,
                        }}
                      />
                    </div>
                  </div>
                </Transition>
                <div
                  className="cursor-pointer"
                  onTouchStart={
                    isMobile()
                      ? () => {
                          handleTouchStart(elem);
                        }
                      : undefined
                  }
                  onTouchEnd={
                    isMobile()
                      ? () => {
                          handleTouchEnd();
                        }
                      : undefined
                  }
                  onClick={
                    !isMobile()
                      ? () => {
                          handleClick(elem);
                        }
                      : undefined
                  }
                >
                  <Card key={i} content={elem} currency={user?.currency} />
                </div>
              </div>
            );
          })
        )}

        {loading ? <LoadingIcon /> : null}
      </div>
      <div className="fixed bottom-[4.5rem] right-3">
        <button
          onClick={openModal}
          className="bg-green text-beige font-bold w-fit rounded-full py-2 px-4 text-base focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Add Debt
        </button>
        <DebtModal
          {...{
            userId: user?._id,
            close: closeModal,
            isOpen: isModalOpen,
          }}
        />
      </div>
    </div>
  );
};
