import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { TransactionItem } from "./transaction-item";
import { useRecoilState } from "recoil";
import {
  newTransactionInitialState,
  newTransactionState,
  useTranscations,
} from "../../data/transactions";

const categories: string[] = [
  "Salary",
  "Food",
  "Transport",
  "Entertainment",
  "Sellings",
  "Tech",
];

export interface UserId {
  userId: string;
}

export default function AddTransactionModal({ userId }: UserId) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTransaction, setNewTransaction] =
    useRecoilState(newTransactionState);
  const { addTransaction } = useTranscations();

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setNewTransaction(newTransactionInitialState);
  }

  useEffect(() => {
    setNewTransaction({
      ...newTransaction,
      userId,
    });
  }, []);

  const onSubmit = () => {
    if (
      newTransaction.concept === "" ||
      newTransaction.amount === 0 ||
      newTransaction.category === ""
    ) {
      alert("Faltan campos por llenar");
    } else {
      addTransaction(newTransaction);
      close();
    }
  };

  return (
    <>
      <Button
        onClick={open}
        className="bg-green text-beige font-bold w-40 rounded-full py-2 px-4 text-base focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Add Transaction
      </Button>

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
                  Add Transaction
                </DialogTitle>

                <div className="flex flex-col gap-4 mt-2">
                  <TransactionItem label="type" categories={[]} />
                  <TransactionItem label="concept" categories={[]} />
                  <TransactionItem label="category" categories={categories} />
                  <TransactionItem label="amount" categories={[]} />
                </div>
              </div>
              <div className="mt-auto pt-4 bg-beige">
                <Button
                  className="w-full rounded-md bg-green py-1.5 px-3 text-2xl font-semibold"
                  onClick={onSubmit}
                >
                  Add
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
