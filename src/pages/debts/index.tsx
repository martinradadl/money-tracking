import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  DebtFormI,
  DebtI,
  newDebtState,
  selectedDebtState,
  useDebts,
} from "../../data/debts";
import { userState } from "../../data/authentication";
import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { AiFillEdit } from "react-icons/ai";
import { Card } from "../../components/movements/card";
import { DeleteMovementModal } from "../../components/movements/delete-movement";
import { DebtModal, newDebtInitialState } from "./debt-modal";
import { isMobile } from "../../helpers/utils";
import { getCurrencyFormat } from "../../helpers/currency";

export const Debts: React.FC = () => {
  const [selectedDebt, setSelectedDebt] = useRecoilState(selectedDebtState);
  const [, setNewDebt] = useRecoilState(newDebtState);
  const [user] = useRecoilState(userState);
  const { getDebts, debtsList, deleteDebt, balance, getBalance } = useDebts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const selectedContainer = useRef<HTMLDivElement | null>(null);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedDebt(null);
    setNewDebt(newDebtInitialState);
  }

  useEffect(() => {
    if (user?._id) getDebts();
  }, [user?._id]);

  useEffect(() => {
    if (user) getBalance();
  }, [user?._id, debtsList]);

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
    <div className="flex flex-col flex-1 pt-2 pb-14 px-5 gap-4 overflow-y-auto entrance-anim">
      <h1 className="page-title text-beige">Debts</h1>
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
        {debtsList.map((elem, i) => {
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
        })}
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
