import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MovementForm } from "../../components/movements/movement-form";
import { createToastify } from "../../helpers/toastify";
import { newDebtState, selectedDebtState, useDebts } from "../../data/debts";
import { useRecoilState } from "recoil";
import { noCategory } from "../../helpers/categories";

export interface props {
  userId?: string;
  close: () => void;
  isOpen: boolean;
}

export const DebtModal = ({ userId, close, isOpen }: props) => {
  const [newDebt, setNewDebt] = useRecoilState(newDebtState);
  const [selectedDebt] = useRecoilState(selectedDebtState);
  const { addDebt, editDebt } = useDebts();

  useEffect(() => {
    if (selectedDebt) {
      setNewDebt({ ...selectedDebt });
    } else {
      setNewDebt({
        type: "loan",
        beneficiary: "",
        concept: "",
        category: noCategory,
        amount: "",
        userId,
      });
    }
  }, [selectedDebt]);

  const isSameDebt = () => {
    return (
      newDebt?.type === selectedDebt?.type &&
      newDebt?.beneficiary === selectedDebt?.beneficiary &&
      newDebt?.concept === selectedDebt?.concept &&
      newDebt?.amount === selectedDebt?.amount &&
      newDebt?.category._id === selectedDebt?.category._id
    );
  };

  const hasEmptyFields = () => {
    return (
      newDebt?.beneficiary === "" ||
      newDebt?.concept === "" ||
      newDebt?.amount === "" ||
      newDebt?.amount === "0" ||
      newDebt?.category._id === ""
    );
  };

  const onSubmit = () => {
    if (newDebt) {
      if (hasEmptyFields()) {
        createToastify({ text: "There are empty fields", type: "warning" });
      } else {
        if (selectedDebt?._id) {
          if (isSameDebt()) {
            createToastify({ text: "There are no changes", type: "warning" });
            return;
          } else {
            editDebt(selectedDebt._id, newDebt);
          }
        } else {
          addDebt(newDebt);
        }
        close();
      }
    }
  };

  return (
    <>
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
                  {`${selectedDebt ? "Edit" : "Add"} Debt`}
                </DialogTitle>

                <MovementForm
                  {...{
                    newMovement: newDebt,
                    setNewMovement: setNewDebt,
                  }}
                />
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
};
