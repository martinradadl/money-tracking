import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MovementForm } from "../../components/movements/movement-form";
import { createToastify } from "../../helpers/toastify";
import {
  newDebtInitialState,
  setNewDebt,
  useDebts,
  getTotalLoans,
  getTotalDebts,
  addDebt,
  editDebt,
} from "../../data/debts";
import { useShallow } from "zustand/react/shallow";
import { removeCookie } from "../../helpers/cookies";

interface Props {
  userId?: string;
  close: () => void;
  isOpen: boolean;
}

export const DebtModal = ({ userId, close, isOpen }: Props) => {
  const { newDebt, selectedDebt } = useDebts(
    useShallow((state) => ({
      newDebt: state.newDebt,
      selectedDebt: state.selectedDebt,
    }))
  );

  useEffect(() => {
    if (selectedDebt) {
      setNewDebt({ ...selectedDebt });
    } else {
      setNewDebt({ ...newDebtInitialState, userId });
    }
  }, [selectedDebt]);

  const isSameDebt = () => {
    return (
      newDebt?.type === selectedDebt?.type &&
      newDebt?.entity === selectedDebt?.entity &&
      newDebt?.concept === selectedDebt?.concept &&
      newDebt?.amount === selectedDebt?.amount &&
      newDebt?.category._id === selectedDebt?.category._id
    );
  };

  const hasEmptyFields = () => {
    return (
      newDebt?.entity === "" ||
      newDebt?.amount === "" ||
      newDebt?.amount === "0" ||
      newDebt?.category._id === ""
    );
  };

  const updateBalance = (type: string) => {
    if (type === "loan") {
      removeCookie("loansCache");
      getTotalLoans();
    } else {
      removeCookie("debtsCache");
      getTotalDebts();
    }
  };

  const onSubmit = async () => {
    if (newDebt) {
      if (hasEmptyFields()) {
        createToastify({ text: "There are empty fields", type: "warning" });
      } else {
        if (selectedDebt?._id) {
          if (isSameDebt()) {
            createToastify({ text: "There are no changes", type: "warning" });
            return;
          } else {
            await editDebt(selectedDebt._id, newDebt);
            if (selectedDebt.amount !== newDebt.amount) {
              updateBalance(selectedDebt.type);
            }
          }
        } else {
          await addDebt(newDebt);
          updateBalance(newDebt.type);
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
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto h-dvh">
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
