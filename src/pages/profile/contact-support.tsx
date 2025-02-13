import { useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { Dialog, DialogPanel } from "@headlessui/react";

export interface props {
  modalTrigger: React.ReactNode;
}

export const ContactSupportModal = ({ modalTrigger }: props) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div onClick={open}>{modalTrigger}</div>

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
                    <b>Contact Support</b>
                  </h3>
                  <p>
                    You can contact us by sending an email to
                    <b> martinrprojects@gmail.com</b>
                  </p>
                </div>

                <button
                  className="bg-green text-navy font-bold w-28 rounded-full py-2 px-4 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  onClick={close}
                >
                  OK
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
