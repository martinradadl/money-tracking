import { useEffect, useState } from "react";
import { createToastify } from "../../helpers/toastify";
import { userState } from "../../data/authentication";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Select,
} from "@headlessui/react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { currencies } from "../../data/transactions";
import { ConfirmPasswordModal } from "./confirm-password";
import { useRecoilState } from "recoil";

export interface props {
  userId?: string;
  modalTrigger: React.ReactNode;
}

const accountFormInitialState = {
  name: "",
  email: "",
  currency: "",
};

export default function AccountSettingsModal({ modalTrigger }: props) {
  const [user] = useRecoilState(userState);
  const [accountForm, setAccountForm] = useState(accountFormInitialState);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name,
        email: "",
        currency: "USD",
      });
    }
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setAccountForm(accountFormInitialState);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAccountForm({
      ...accountForm,
      [event.target.name]: event.target.value,
    });
  };

  const hasEmptyFields = () => {
    return (
      accountForm.name === "" ||
      accountForm.email === "" ||
      accountForm.currency === ""
    );
  };

  function openConfirmModal() {
    setIsConfirmModalOpen(true);
  }

  function closeConfirmModal() {
    setIsConfirmModalOpen(false);
  }

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
                  Account Settings
                </DialogTitle>

                <div className="flex flex-col gap-4 mt-2">
                  <label>
                    <p className="text-2xl mb-2">Name</p>
                    <input
                      className="w-full h-9 px-2 border-navy bg-green border-b-2"
                      id="name"
                      name="name"
                      value={accountForm.name}
                      onChange={handleChange}
                      maxLength={40}
                    />
                  </label>

                  <label>
                    <p className="text-2xl mb-2">Email</p>
                    <input
                      className="w-full h-9 px-2 border-navy bg-green border-b-2"
                      id="email"
                      name="email"
                      value={accountForm.email}
                      onChange={handleChange}
                      maxLength={40}
                    />
                  </label>

                  <label>
                    <p className="text-2xl mb-2">Currency</p>
                    <Select
                      name="currency"
                      id="currency"
                      value={accountForm.currency}
                      onChange={handleChange}
                      className="w-full h-9 border-navy rounded bg-green border-b-2"
                    >
                      <option style={{ display: "none" }}></option>
                      {currencies.map((elem, i) => {
                        return (
                          <option key={i} value={elem}>
                            {elem}
                          </option>
                        );
                      })}
                    </Select>
                  </label>
                </div>
              </div>
              <div className="mt-auto pt-4 bg-green">
                <Button
                  className="w-full rounded-md bg-navy text-beige py-1.5 px-3 text-2xl font-semibold"
                  onClick={() => {
                    if (hasEmptyFields()) {
                      createToastify({
                        text: "There are empty fields",
                        type: "warning",
                      });
                    } else {
                      openConfirmModal();
                    }
                  }}
                >
                  Submit
                </Button>
                <ConfirmPasswordModal
                  {...{
                    isOpen: isConfirmModalOpen,
                    close: closeConfirmModal,
                    userId: user?._id,
                    accountForm,
                  }}
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
