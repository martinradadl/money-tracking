import { useState } from "react";
import { useRecoilState } from "recoil";
import {
  selectedTransactionState,
  useTranscations,
} from "../../data/transactions";
import { AiFillDelete, AiOutlineWarning } from "react-icons/ai";
import { Dialog, DialogPanel } from "@headlessui/react";

export const DeleteTransactionModal = () => {
  const [selectedTransaction, setSelectedTransaction] = useRecoilState(
    selectedTransactionState
  );
  const { deleteTransaction } = useTranscations();
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

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
                    <b>Delete Transaction</b>
                  </h3>
                  <p> Are you sure you want to delete this transaction?</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={close}
                    className="bg-navy text-beige font-bold w-24 rounded-full py-1 px-2 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={() => {
                      if (selectedTransaction?._id) {
                        deleteTransaction(selectedTransaction._id);
                        setSelectedTransaction(null);
                      }
                    }}
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
