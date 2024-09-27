import React, { useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { AiFillEdit } from "react-icons/ai";
import { Transaction } from "./transaction";
import TransactionModal from "./transaction-modal";
import classNames from "classnames";
import { useRecoilState } from "recoil";
import {
  useTranscations,
  selectedTransactionState,
  TransactionI,
  TransactionFormI,
} from "../../data/transactions";
import { DeleteTransactionModal } from "./delete-modal";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Transactions: React.FC = () => {
  const userId = "66ec90d4b70ffd335b3248a2";
  const [selectedTransaction, setSelectedTransaction] = useRecoilState(
    selectedTransactionState
  );
  const {
    getTransactions,
    getCategories,
    getBalance,
    transactionsList,
    balance,
  } = useTranscations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timer = useRef(0);
  const selectedContainer = useRef<HTMLDivElement | null>(null);
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.user) {
      navigate(`/login`);
    }
  }, []);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }

  useEffect(() => {
    getCategories();
    getTransactions(userId);
  }, [userId]);

  useEffect(() => {
    if (userId) getBalance(userId);
  }, [userId]);

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

  return (
    <div className="flex flex-col flex-1 pb-14 px-4 gap-4 overflow-y-auto entrance-anim">
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
                    className="bg-beige text-navy rounded-full p-[0.4rem] text-2xl"
                  >
                    <AiFillEdit />
                  </div>
                  <div className="bg-beige text-red rounded-full p-[0.4rem] text-2xl">
                    <DeleteTransactionModal />
                  </div>
                </div>
              </Transition>
              <div
                onTouchStart={() => {
                  handleTouchStart(elem);
                }}
                onTouchEnd={handleTouchEnd}
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
