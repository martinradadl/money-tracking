import React, { useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { Dialog, DialogPanel } from "@headlessui/react";
import { checkPassword, useAuth, UserI } from "../../data/authentication";
import { createToastify } from "../../helpers/toastify";

export interface props {
  isOpen: boolean;
  close: () => void;
  userId?: string;
  accountForm?: UserI;
  isDelete?: boolean;
  closeAccountSettings?: () => void;
}

export const ConfirmPasswordModal = ({
  isOpen,
  close,
  userId,
  accountForm,
  isDelete,
  closeAccountSettings,
}: props) => {
  const [password, setPassword] = useState("");
  const { editUser, deleteUser } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onSubmit = async () => {
    if (password === "") {
      createToastify({ text: "There are empty fields", type: "warning" });
    } else {
      if (userId) {
        const isCorrectPassword = await checkPassword(userId, password);
        if (isCorrectPassword) {
          if (isDelete) deleteUser(userId);
          else if (accountForm) editUser(userId, accountForm);
          close();
          if (closeAccountSettings) closeAccountSettings();
        } else {
          createToastify({
            text: "The password you typed is not valid",
            type: "error",
          });
        }
      }
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => {
          close();
          setPassword("");
        }}
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
                    <b>{isDelete ? "Delete Account" : "Edit User"}</b>
                  </h3>
                  <p>Confirm your password to proceed</p>
                </div>
                <input
                  type="password"
                  className="w-full h-9 px-2 border-navy bg-beige border-b-2"
                  value={password}
                  onChange={handleChange}
                  maxLength={40}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      close();
                      setPassword("");
                    }}
                    className="bg-navy text-beige font-bold w-24 rounded-full py-1 px-2 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmit}
                    className="bg-green text-navy font-bold w-28 rounded-full py-2 px-4 text-sm focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
                  >
                    Confirm
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
