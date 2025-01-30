import { AiFillCheckCircle } from "react-icons/ai";
import { Dialog, DialogPanel } from "@headlessui/react";
import { logout } from "../../data/authentication";

export interface props {
  isOpen: boolean;
}

export const SuccessModal = ({ isOpen }: props) => {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={logout}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
          <div className="flex items-center justify-center w-full text-navy">
            <DialogPanel
              transition
              className="w-[90%] rounded-md shadow-[0_0_60px_4px_rgba(0,0,0,0.3)] flex flex-col place-content-between h-fit overflow-y-scroll bg-beige p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex flex-col gap-4 items-center justify-center">
                <AiFillCheckCircle className="text-4xl text-green" />
                <div className="flex flex-col gap-1 items-center justify-center text-center">
                  <h3>
                    <b>Password successfully changed!</b>
                  </h3>
                  <p>You will be logged out</p>
                </div>
                <button
                  onClick={logout}
                  className="bg-green text-navy font-bold w-28 rounded-full py-2 px-4 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
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
