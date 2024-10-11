import React, { useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { AiFillEdit } from "react-icons/ai";
import { Card } from "../../components/cards/card";
import classNames from "classnames";
import { useRecoilState } from "recoil";
import {
  useTranscations,
  selectedTransactionState,
  TransactionI,
  TransactionFormI,
  newTransactionState,
} from "../../data/transactions";
import { DeleteCardModal } from "../../components/cards/delete-card";
import { userState } from "../../data/authentication";
import { getCurrencyFormat } from "../../helpers/currency";
import { useCategories } from "../../data/categories";
import CardModal from "../../components/cards/card-modal";

export const Transactions: React.FC = () => {
  const [selectedTransaction, setSelectedTransaction] = useRecoilState(
    selectedTransactionState
  );
  const [newTransaction, setNewTransaction] =
    useRecoilState(newTransactionState);
  const [user] = useRecoilState(userState);
  const {
    getTransactions,
    getBalance,
    transactionsList,
    balance,
    deleteTransaction,
    addTransaction,
    editTransaction,
  } = useTranscations();
  const { getCategories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const selectedContainer = useRef<HTMLDivElement | null>(null);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }

  useEffect(() => {
    getCategories();
    getTransactions();
  }, [user]);

  useEffect(() => {
    if (user) getBalance();
  }, [user, transactionsList]);

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
    <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-4 overflow-y-auto entrance-anim">
      <h1 className="py-2 text-4xl text-beige font-semibold">Transactions</h1>
      <div className="flex w-full gap-3 py-1 text-2xl font-semibold">
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
                    className="bg-beige text-navy rounded-full p-[0.4rem] text-2xl"
                  >
                    <AiFillEdit />
                  </div>
                  <div className="bg-beige text-red rounded-full p-[0.4rem] text-2xl">
                    <DeleteCardModal
                      {...{
                        selectedCard: selectedTransaction,
                        setSelectedCard: setSelectedTransaction,
                        deleteCard: deleteTransaction,
                      }}
                    />
                  </div>
                </div>
              </Transition>
              <div
                onTouchStart={() => {
                  handleTouchStart(elem);
                }}
                onTouchEnd={handleTouchEnd}
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
          className="bg-green text-beige font-bold w-40 rounded-full py-2 px-4 text-base focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Add Transaction
        </button>
        <CardModal
          {...{
            userId: user?._id,
            close: closeModal,
            isOpen: isModalOpen,
            newCard: newTransaction,
            setNewCard: setNewTransaction,
            selectedCard: selectedTransaction,
            addCard: addTransaction,
            editCard: editTransaction,
          }}
        />
      </div>
    </div>
  );
};
