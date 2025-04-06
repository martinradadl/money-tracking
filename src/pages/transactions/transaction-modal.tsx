import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MovementForm } from "../../components/movements/movement-form";
import { createToastify } from "../../helpers/toastify";
import {
  useTransactions,
  setNewTransaction,
  newTransactionInitialState,
  getTotalIncome,
  getTotalExpenses,
  addTransaction,
  editTransaction,
} from "../../data/transactions";
import { useCookies } from "react-cookie";
import { useShallow } from "zustand/shallow";

export interface props {
  userId?: string;
  close: () => void;
  isOpen: boolean;
}

export const TransactionModal = ({ userId, close, isOpen }: props) => {
  const { newTransaction, selectedTransaction } = useTransactions(
    useShallow((state) => ({
      newTransaction: state.newTransaction,
      selectedTransaction: state.selectedTransaction,
    }))
  );
  const [, , removeCookie] = useCookies(["incomeCache", "expensesCache"]);

  useEffect(() => {
    if (selectedTransaction) {
      setNewTransaction({ ...selectedTransaction });
    } else {
      setNewTransaction({
        ...newTransactionInitialState,
        userId,
      });
    }
  }, [selectedTransaction]);

  useEffect(() => {}, [newTransaction]);

  const isSameTransaction = () => {
    return (
      newTransaction?.type === selectedTransaction?.type &&
      newTransaction?.concept === selectedTransaction?.concept &&
      newTransaction?.amount === selectedTransaction?.amount &&
      newTransaction?.category._id === selectedTransaction?.category._id &&
      newTransaction?.date === selectedTransaction?.date
    );
  };

  const hasEmptyFields = () => {
    return (
      newTransaction?.concept === "" ||
      newTransaction?.amount === "" ||
      newTransaction?.amount === "0" ||
      newTransaction?.category._id === ""
    );
  };

  const updateBalance = (type: string) => {
    if (type === "income") {
      removeCookie("incomeCache");
      getTotalIncome({});
    } else {
      removeCookie("expensesCache");
      getTotalExpenses({});
    }
  };

  const onSubmit = async () => {
    if (newTransaction) {
      if (hasEmptyFields()) {
        createToastify({ text: "There are empty fields", type: "warning" });
      } else {
        if (selectedTransaction?._id) {
          if (isSameTransaction()) {
            createToastify({ text: "There are no changes", type: "warning" });
            return;
          } else {
            await editTransaction(selectedTransaction._id, newTransaction);
            if (selectedTransaction.amount !== newTransaction.amount) {
              updateBalance(selectedTransaction.type);
            }
          }
        } else {
          await addTransaction(newTransaction);
          updateBalance(newTransaction.type);
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
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-dvh">
          <div className="flex min-h-full items-center justify-center text-navy">
            <DialogPanel
              transition
              className="w-full flex flex-col place-content-between h-screen overflow-scroll bg-green font-semibold py-4 px-5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="overflow-auto">
                <AiOutlineArrowLeft className="text-3xl my-2" onClick={close} />

                <DialogTitle className="text-3xl py-2">
                  {`${selectedTransaction ? "Edit" : "Add"} Transaction`}
                </DialogTitle>

                <MovementForm
                  {...{
                    newMovement: newTransaction,
                    setNewMovement: setNewTransaction,
                  }}
                />
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
