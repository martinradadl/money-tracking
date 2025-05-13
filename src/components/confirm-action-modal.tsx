import { Dialog, DialogPanel } from "@headlessui/react";

export interface props {
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
  action: (...args: unknown[]) => unknown;
}

export const ConfirmActionModal = ({ isOpen, setIsOpen, action }: props) => {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
          <div className="flex items-center justify-center w-full text-navy">
            <DialogPanel
              transition
              className="w-[90%] rounded-md shadow-[0_0_60px_4px_rgba(0,0,0,0.3)] flex flex-col place-content-between h-fit overflow-y-scroll bg-beige p-4 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex flex-col gap-1 items-center justify-center text-center">
                  <h3>Are you sure you want to perform this action?</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      action();
                      setIsOpen(false);
                    }}
                    className="bg-green text-navy font-bold w-28 rounded-full py-2 px-4 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="bg-red text-beige font-bold w-28 rounded-full py-2 px-4 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    Cancel
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
