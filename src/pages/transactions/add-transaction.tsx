import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { TransactionItem } from "./transaction-item";

const categories: string[] = [
  "Salary",
  "Food",
  "Transport",
  "Entertainment",
  "Sellings",
  "Tech",
];

export default function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

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
              className="relative w-full flex flex-col place-content-between h-screen overflow-y-auto bg-beige p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div>
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
              <div className="absolute left-0 right-0 bottom-0 p-4 bg-beige">
                <Button
                  className="w-full rounded-md bg-green py-1.5 px-3 text-2xl font-semibold"
                  onClick={close}
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
