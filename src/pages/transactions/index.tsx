import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Transaction } from "./transaction";
import TransactionModal from "./transaction-modal";
import classNames from "classnames";
import { useRecoilState } from "recoil";
import {
  getBalance,
  transactionsListState,
  useTranscations,
  selectedTransactionState,
  TransactionI,
  newTransactionState,
} from "../../data/transactions";

export const Transactions: React.FC = () => {
  const [transactionsList] = useRecoilState(transactionsListState);
  const [selectedTransaction, setSelectedTransaction] = useRecoilState(
    selectedTransactionState
  );
  const [_, setNewTransaction] = useRecoilState(newTransactionState);
  const { getTransactions } = useTranscations();
  const userId = "1234";
  const balance = getBalance(transactionsList);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }

  useEffect(() => {
    getTransactions(userId);
  }, [userId]);

  const showOptions = (transaction: TransactionI) => {
    // const timer = setTimeout(() => {
    //   setSelectedTransaction(transaction);
    // }, 500);
    // return timer;
    setSelectedTransaction(transaction);
  };

  const useOutsideClick = (callback: Function) => {
    const ref: RefObject<HTMLDivElement> = useRef(null);
    useEffect(() => {
      const handleClick = (event: Event) => {
        callback();
      };
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    }, []);
    return ref;
  };

  const handleClickOutside = () => {
    setSelectedTransaction(null);
  };

  const ref = useOutsideClick(handleClickOutside);

  return (
    <div className="flex flex-col flex-1 pb-14 px-4 gap-4 overflow-y-auto">
      <h1 className="mx-auto py-2 text-4xl text-beige font-semibold">
        Transactions
      </h1>
      <div className="flex w-full gap-3 pl-2 py-1 text-2xl font-semibold">
        <p className="text-beige">My Balance:</p>
        <p
          className={classNames(
            balance >= 0
              ? "bg-green-pastel text-navy"
              : "bg-red-pastel text-beige",
            "rounded px-2 py-0.5 font-semibold"
          )}
        >
          {`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }).format(balance)}`}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {transactionsList.map((elem, i) => {
          return (
            <div ref={ref} key={i} className="relative">
              {selectedTransaction?._id === elem._id ? (
                <div className="absolute -top-4 right-2 flex gap-3">
                  <div
                    onClick={openModal}
                    className="bg-beige text-navy rounded-full p-1 text-lg"
                  >
                    <AiFillEdit />
                  </div>
                  <div className="bg-beige text-red rounded-full p-1 text-lg">
                    <AiFillDelete />
                  </div>
                </div>
              ) : null}
              <div
                onTouchStart={() => {
                  showOptions(elem);
                }}
              >
                <Transaction key={i} transaction={elem} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-[4.5rem] right-3">
        <button
          onClick={openModal}
          className="bg-green text-beige font-bold w-40 rounded-full py-2 px-4 text-base focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Add Transaction
        </button>
        <TransactionModal
          {...{
            userId,
            close: closeModal,
            isOpen: isModalOpen,
          }}
        />
      </div>
    </div>
  );
};
