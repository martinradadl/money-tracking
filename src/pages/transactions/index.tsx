import React, { useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { AiFillEdit } from "react-icons/ai";
import { Card } from "../../components/movements/card";
import classNames from "classnames";
import { useRecoilState } from "recoil";
import {
  useTransactions,
  selectedTransactionState,
  TransactionI,
  TransactionFormI,
  newTransactionState,
} from "../../data/transactions";
import { DeleteMovementModal } from "../../components/movements/delete-movement";
import { userState } from "../../data/authentication";
import { getCurrencyFormat } from "../../helpers/currency";
import {
  newTransactionInitialState,
  TransactionModal,
} from "./transaction-modal";
import { isMobile } from "../../helpers/utils";

export const Transactions: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useRecoilState(
    selectedTransactionState
  );
  const [, setNewTransaction] = useRecoilState(newTransactionState);

  const [user] = useRecoilState(userState);
  const {
    getTransactions,
    getBalance,
    transactionsList,
    balance,
    deleteTransaction,
  } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const selectedContainer = useRef<HTMLDivElement | null>(null);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setNewTransaction(newTransactionInitialState);
  }

  useEffect(() => {
    if (user?._id) getTransactions();
  }, [user?._id]);

  useEffect(() => {
    if (user) getBalance();
  }, [user?._id, transactionsList]);

  useEffect(() => {
    if (!isMobile() && !selectedTransaction) {
      document.addEventListener("mousedown", handleClickedOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickedOutside, true);
      };
    }
  }, [selectedTransaction?._id]);

  const handleClickedOutside = (event: Event) => {
    if (
      selectedContainer.current &&
      !selectedContainer.current.contains(event.target as Node) &&
      !isModalOpen
    ) {
      setSelectedTransaction(null);
    }
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

  const handleClick = (transaction: TransactionI) => {
    setSelectedTransaction(transaction as unknown as TransactionFormI);
  };

  return (
    <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-4 overflow-y-auto entrance-anim">
      <h1 className="page-title text-beige">Transactions</h1>
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
      <div className="flex flex-col gap-3">
        {transactionsList.map((elem, i) => {
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
                    onClick={() => {
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
        })}
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
