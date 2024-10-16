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

export const Debts: React.FC = () => {
  const [selectedDebt, setSelectedDebt] = useRecoilState(selectedDebtState);
  const [, setNewDebt] = useRecoilState(newDebtState);
  const [user] = useRecoilState(userState);
  const { getDebts, debtsList, deleteDebt } = useDebts();
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

  const handleClickedOutside = (event: Event) => {
    if (
      selectedContainer.current &&
      !selectedContainer.current.contains(event.target as Node) &&
      !isModalOpen
    ) {
      setSelectedDebt(null);
    }
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
      <h1 className="py-2 text-4xl text-beige font-semibold">Debts</h1>

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
                    className="bg-beige text-navy rounded-full p-[0.4rem] text-2xl"
                  >
                    <AiFillEdit />
                  </div>
                  <div className="bg-beige text-red rounded-full p-[0.4rem] text-2xl">
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
