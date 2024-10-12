import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { CardForm } from "./card-form";
import { SetterOrUpdater } from "recoil";
import { createToastify } from "../../helpers/toastify";
import { DebtFormI, DebtType } from "../../data/debts";
import { TransactionFormI } from "../../data/transactions";

function isDebt(item: TransactionFormI| DebtFormI):item is DebtFormI {
  return (item as DebtFormI).beneficiary !== undefined && (item as DebtFormI).type ==="debt"
}

export interface props<T extends DebtFormI | TransactionFormI> {
  userId?: string;
  close: () => void;
  isOpen: boolean;
  newCard: T;
  setNewCard: (item:T)=>void;
  selectedCard: T;
  addCard: (newItem: T) => Promise<void>;
  editCard: (id: string, updatedItem: T) => Promise<void>;
}

export const CardModal = <T extends  DebtFormI | TransactionFormI>({
  userId,
  close,
  isOpen,
  newCard,
  setNewCard,
  selectedCard,
  addCard,
  editCard,
}: props<T>) => {

  useEffect(() => {
    if (selectedCard) {
      setNewCard({ ...selectedCard });
    } else {
      if (isDebt(newCard)) {
        setNewCard({
          type: "debt",
          beneficiary: "",
          concept: "",
          category: { _id: "670877bf07255749b8882674", label: "N/A" },
          amount: "",
          userId,
        });
      } else {
        setNewCard({
          type: "",
          concept: "",
          category: { _id: "670877bf07255749b8882674", label: "N/A" },
          amount: "",
          userId,
        });
      }
    }
  }, [selectedCard]);

  const isSameCard = () => {
    if (
      "beneficiary" in newCard &&
      "beneficiary" in selectedCard &&
      newCard?.beneficiary !== selectedCard?.beneficiary
    ) {
      return false;
    } else {
      return (
        newCard?.type === selectedCard?.type &&
        newCard?.concept === selectedCard?.concept &&
        newCard?.amount === selectedCard?.amount &&
        newCard?.category._id === selectedCard?.category._id
      );
    }
  };

  const hasEmptyFields = () => {
    return (
      newCard?.concept === "" ||
      newCard?.amount === "" ||
      newCard?.amount === "0" ||
      newCard?.category._id === "" ||
      ("beneficiary" in newCard && newCard?.beneficiary === "")
    );
  };

  const onSubmit = () => {
    if (newCard) {
      if (hasEmptyFields()) {
        createToastify({ text: "There are empty fields", type: "warning" });
      } else {
        if (selectedCard?._id) {
          if (isSameCard()) {
            createToastify({ text: "There are no changes", type: "warning" });
            return;
          } else {
            editCard(selectedCard._id, newCard);
          }
        } else {
          addCard(newCard);
        }
        close();
      }
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-navy">
            <DialogPanel
              transition
              className="w-full flex flex-col place-content-between h-screen overflow-scroll bg-green font-semibold py-4 px-5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="overflow-auto">
                <AiOutlineArrowLeft className="text-3xl my-2" onClick={close} />

                <DialogTitle className="text-3xl py-2">
                  {isDebt(selectedCard)
                    ? `${selectedCard ? "Add" : "Edit"} Debt`
                    : `${selectedCard ? "Add" : "Edit"} Transaction`}
                </DialogTitle>

                <CardForm {...{ newCard, setNewCard }} />
              </div>
              <div className="mt-auto pt-4 bg-green">
                <Button
                  className="w-full rounded-md bg-navy text-beige py-1.5 px-3 text-2xl font-semibold"
                  onClick={onSubmit}
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
