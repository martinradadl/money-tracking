import React, { useState } from "react";
import { createToastify } from "../../helpers/toastify";
import { useAuth } from "../../data/authentication";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AiOutlineArrowLeft } from "react-icons/ai";

export interface props {
  userId?: string;
  modalTrigger: React.ReactNode;
}

export interface passwordFormProps {
  current: string;
  new: string;
  confirm?: string;
}

const passwordFormInitialState: passwordFormProps = {
  current: "",
  new: "",
  confirm: "",
};

export default function ChangePasswordModal({ userId, modalTrigger }: props) {
  const { changePassword } = useAuth();
  const [passwordForm, setPasswordForm] = useState(passwordFormInitialState);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setPasswordForm(passwordFormInitialState);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value,
    });
  };

  const newPasswordConfirmed = () => {
    return passwordForm.new === passwordForm.current;
  };

  const hasEmptyFields = () => {
    return (
      passwordForm.current === "" ||
      passwordForm.new === "" ||
      passwordForm.confirm === ""
    );
  };

  const onSubmit = () => {
    if (hasEmptyFields()) {
      createToastify({ text: "There are empty fields", type: "warning" });
    } else if (!newPasswordConfirmed()) {
      createToastify({
        text: "Confirmed password does not match",
        type: "warning",
      });
    } else {
      const passwordsSubmitted = { ...passwordForm };
      delete passwordsSubmitted["confirm"];
      if (userId) changePassword(userId, passwordsSubmitted);
    }
    close();
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
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-navy">
            <DialogPanel
              transition
              className="w-full flex flex-col place-content-between h-screen overflow-scroll bg-green font-semibold py-4 px-5 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="overflow-auto">
                <AiOutlineArrowLeft className="text-3xl my-2" onClick={close} />

                <DialogTitle className="text-3xl py-2">
                  Change Password
                </DialogTitle>

                <div className="flex flex-col gap-4 mt-2">
                  <label>
                    <p className="text-2xl mb-2">Current password</p>
                    <input
                      className="w-full h-9 px-2 border-navy bg-green border-b-2"
                      id="current"
                      name="current"
                      value={passwordForm.current}
                      onChange={handleChange}
                      maxLength={40}
                    />
                  </label>

                  <label>
                    <p className="text-2xl mb-2">New password</p>
                    <input
                      className="w-full h-9 px-2 border-navy bg-green border-b-2"
                      id="new"
                      name="new"
                      value={passwordForm.new}
                      onChange={handleChange}
                      maxLength={40}
                    />
                  </label>

                  <label>
                    <p className="text-2xl mb-2">Confirm password</p>
                    <input
                      className="w-full h-9 px-2 border-navy bg-green border-b-2"
                      id="confirm"
                      name="confirm"
                      value={passwordForm.confirm}
                      onChange={handleChange}
                      maxLength={40}
                    />
                  </label>
                </div>
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
}