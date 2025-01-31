import { useState } from "react";
import { AiFillDelete, AiOutlineWarning } from "react-icons/ai";
import { Dialog, DialogPanel } from "@headlessui/react";
import { DebtFormI, getTotalLoans, getTotalDebts } from "../../data/debts";
import {
  TransactionFormI,
  getTotalIncome,
  getTotalExpenses,
} from "../../data/transactions";
import { useCookies } from "react-cookie";

export interface props<T extends DebtFormI | TransactionFormI> {
  selectedMovement: T | null;
  setSelectedMovement: (movement: T | null) => void;
  deleteMovement: (id: string) => void;
}

export const DeleteMovementModal = <T extends DebtFormI | TransactionFormI>({
  selectedMovement,
  setSelectedMovement,
  deleteMovement,
}: props<T>) => {
  const isDebt = selectedMovement && "entity" in selectedMovement;
  const [isOpen, setIsOpen] = useState(false);
  const [, , removeCookie] = useCookies([
    "incomeCache",
    "expensesCache",
    "loansCache",
    "debtsCache",
  ]);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setSelectedMovement(null);
  }

  const handleDeleteMovement = async () => {
    if (selectedMovement?._id) {
      await deleteMovement(selectedMovement._id);

      switch (selectedMovement.type) {
        case "income":
          removeCookie("incomeCache");
          getTotalIncome();
          break;
        case "expenses":
          removeCookie("expensesCache");
          getTotalExpenses();
          break;
        case "loan":
          removeCookie("loansCache");
          getTotalLoans();
          break;
        case "debt":
          removeCookie("debtsCache");
          getTotalDebts();
          break;
        default:
          break;
      }
      setSelectedMovement(null);
    }
  };

  return (
    <>
      <AiFillDelete onClick={open} />
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
          <div className="flex items-center justify-center w-full text-navy">
            <DialogPanel
              transition
              className="w-[90%] rounded-md shadow-[0_0_60px_4px_rgba(0,0,0,0.3)] flex flex-col place-content-between h-fit overflow-y-scroll bg-beige p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex flex-col gap-4 items-center justify-center">
                <AiOutlineWarning className="text-4xl text-red" />
                <div className="flex flex-col gap-1 items-center justify-center text-center">
                  <h3>
                    <b>Delete {isDebt ? "Debt" : "Transaction"}</b>
                  </h3>
                  <p>Are you sure you want to delete this?</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={close}
                    className="bg-navy text-beige font-bold w-24 rounded-full py-1 px-2 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleDeleteMovement}
                    className="bg-red text-beige font-bold w-28 rounded-full py-2 px-4 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
