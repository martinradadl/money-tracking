import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AiFillEdit } from "react-icons/ai";
import { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { TransactionForm } from "./transaction-form";
import { useRecoilState } from "recoil";
import {
  newTransactionState,
  TransactionI,
  useTranscations,
} from "../../data/transactions";

export interface props {
  userId: string;
  selectedTransaction: TransactionI | null;
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export default function TransactionModal({
  userId,
  selectedTransaction,
  open,
  close,
  isOpen,
}: props) {
  const [newTransaction, setNewTransaction] =
    useRecoilState(newTransactionState);
  const { addTransaction, editTransaction } = useTranscations();

  useEffect(() => {
    if (selectedTransaction) {
      setNewTransaction({ ...selectedTransaction });
    } else {
      setNewTransaction({
        type: "income",
        concept: "",
        category: "",
        amount: 0,
        userId,
      });
    }
  }, []);

  const isSameTransaction = () => {
    return (
      newTransaction?.type === selectedTransaction?.type &&
      newTransaction?.concept === selectedTransaction?.concept &&
      newTransaction?.amount === selectedTransaction?.amount &&
      newTransaction?.category === selectedTransaction?.category
    );
  };

  const hasEmptyFields = () => {
    return (
      newTransaction?.concept === "" ||
      newTransaction?.amount === 0 ||
      newTransaction?.category === ""
    );
  };

  const onSubmit = () => {
    if (newTransaction) {
      if (hasEmptyFields()) {
        alert("Faltan campos por llenar");
      } else {
        if (selectedTransaction?._id && !isSameTransaction()) {
          editTransaction(selectedTransaction._id, newTransaction);
        } else {
          addTransaction(newTransaction);
        }
        close();
      }
    }
  };

  useEffect(() => {
    console.log(selectedTransaction);
  }, [selectedTransaction]);

  return (
    <>
      {selectedTransaction ? (
        <Button
          onClick={open}
          className="bg-beige text-navy rounded-full p-1 text-lg"
        >
          <AiFillEdit />
        </Button>
      ) : (
        <Button
          onClick={open}
          className="bg-green text-beige font-bold w-40 rounded-full py-2 px-4 text-base focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
        >
          Add Transaction
        </Button>
      )}

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
              className="w-full flex flex-col place-content-between h-screen overflow-scroll bg-beige p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="overflow-auto">
                <AiOutlineArrowLeft className="text-3xl my-2" onClick={close} />

                <DialogTitle className="text-3xl py-2">
                  {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
                </DialogTitle>

                <TransactionForm />
              </div>
              <div className="mt-auto pt-4 bg-beige">
                <Button
                  className="w-full rounded-md bg-green py-1.5 px-3 text-2xl font-semibold"
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
}
