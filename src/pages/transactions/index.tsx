import React, { useEffect, useMemo, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { AiFillEdit } from "react-icons/ai";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { Card } from "../../components/movements/card";
import classNames from "classnames";
import {
  useTransactions,
  TransactionI,
  TransactionFormI,
  setSelectedTransaction,
  setNewTransaction,
  newTransactionInitialState,
  getTransactions,
  deleteTransaction,
  getTotalIncome,
  getTotalExpenses,
  setIsInitialLoad,
  nextPage,
} from "../../data/transactions";
import { DeleteMovementModal } from "../../components/movements/delete-movement";
import { useAuth } from "../../data/authentication";
import { getCurrencyFormat } from "../../helpers/currency";
import { TransactionModal } from "./transaction-modal";
import { isMobile } from "../../helpers/utils";
import { CardSkeleton } from "../../components/movements/card-skeleton";
import { LoadingIcon } from "../../components/loading-icon";
import { useShallow } from "zustand/shallow";
import debounce from "lodash.debounce";
import { FilterMovementsModal } from "../../components/movements/filter-movements-modal";
import {
  filterFormInitialState,
  FilterMovementForm,
} from "../../helpers/movements";

export const Transactions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const {
    transactionsList,
    selectedTransaction,
    isLastPage,
    totalIncome,
    totalExpenses,
    page,
    isInitialLoad,
  } = useTransactions(
    useShallow((state) => ({
      transactionsList: state.transactionsList,
      selectedTransaction: state.selectedTransaction,
      isLastPage: state.isLastPage,
      page: state.page,
      isInitialLoad: state.isInitialLoad,
      totalIncome: state.totalIncome,
      totalExpenses: state.totalExpenses,
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterMovementForm>(
    filterFormInitialState
  );
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const selectedContainer = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  function openModal() {
    setIsModalOpen(true);
    if (!selectedTransaction) {
      setNewTransaction({ ...newTransactionInitialState, date: new Date() });
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedTransaction(null);
    }, 200);
    setNewTransaction(newTransactionInitialState);
  }

  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) {
      getTotalIncome({});
      getTotalExpenses({});
    }
  }, [user?._id]);

  const balance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const fetchTransactions = async () => {
    if (user?._id) {
      await getTransactions({ page, limit: 10 });
    }
  };

  const debouncedFetchTransactions = debounce(fetchTransactions, 200);

  useEffect(() => {
    if (isInitialLoadRef.current && isInitialLoad && user?._id) {
      isInitialLoadRef.current = false;
      getTransactions({ page: 1, limit: 10 }).then(() => {
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
    if (page > 1 && user?._id && !isLastPage) debouncedFetchTransactions();
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
      setSelectedTransaction(null);
    }
  };

  const handleClickedOutsideWeb = (event: Event) => {
    if (
      selectedContainer.current &&
      !selectedContainer.current.contains(event.target as Node) &&
      !isModalOpen
    ) {
      setSelectedTransaction(null);
    }
    document.removeEventListener("mousedown", handleClickedOutsideWeb, true);
  };

  const handleClick = (transaction: TransactionI) => {
    document.addEventListener("mousedown", handleClickedOutsideWeb, true);
    setSelectedTransaction(transaction as unknown as TransactionFormI);
  };

  const handleTouchStart = (transaction: TransactionI) => {
    timer.current = setTimeout(() => {
      document.addEventListener("touchstart", handleClickedOutside, {
        once: true,
      });
      setSelectedTransaction(transaction as unknown as TransactionFormI);
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
      <h1 className="page-title text-beige">Transactions</h1>
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
                setFilters(filterFormInitialState);
                await getTransactions({ page: 1, limit: 10 }, true);
              }}
            />
          ) : null}
          <FilterMovementsModal
            {...{
              close: () => {
                setIsFilterModalOpen(false);
              },
              isOpen: isFilterModalOpen,
              filters,
              setFilters,
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
          transactionsList.map((elem, i) => {
            return (
              <div key={i} className="relative">
                <Transition show={selectedTransaction?._id === elem._id}>
                  <div
                    ref={selectedContainer}
                    className={classNames(
                      "absolute -top-4 flex gap-3 transition duration-300 ease-in data-[closed]:opacity-0",
                      elem.type === "income" ? "right-1" : "right-5"
                    )}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal();
                      }}
                      className="bg-beige text-navy rounded-full p-[0.4rem] text-2xl cursor-pointer"
                    >
                      <AiFillEdit />
                    </div>
                    <div className="bg-beige text-red rounded-full p-[0.4rem] text-2xl cursor-pointer">
                      <DeleteMovementModal<TransactionFormI>
                        {...{
                          selectedMovement: selectedTransaction,
                          setSelectedMovement: setSelectedTransaction,
                          deleteMovement: deleteTransaction,
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
          Add Transaction
        </button>
        <TransactionModal
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
