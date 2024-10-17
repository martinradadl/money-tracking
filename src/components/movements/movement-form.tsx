import React from "react";
import { useRecoilState } from "recoil";
import { TransactionFormI } from "../../data/transactions";
import { Select } from "@headlessui/react";
import { categoriesState } from "../../data/categories";
import { DebtFormI } from "../../data/debts";

function isDebt(movement: TransactionFormI | DebtFormI | null) {
  return movement && "entity" in movement;
}

export interface props<T extends DebtFormI | TransactionFormI | null> {
  newMovement: T;
  setNewMovement: (movement: T) => void;
}

export const MovementForm = <T extends DebtFormI | TransactionFormI | null>({
  newMovement,
  setNewMovement,
}: props<T>) => {
  const [categories] = useRecoilState(categoriesState);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (newMovement) {
      setNewMovement({
        ...newMovement,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const lastValue = inputValue.substring(inputValue.length - 1);
    const firstValue = inputValue.substring(0, 1);
    const allowedValues = new RegExp("[0-9]+");
    const hasAllowedValues = inputValue
      .split("")
      .every((char) => allowedValues.test(char));
    if (
      newMovement &&
      inputValue.length <= 12 &&
      (!lastValue || hasAllowedValues) &&
      firstValue !== "0"
    ) {
      setNewMovement({
        ...newMovement,
        [event.target.name]: inputValue,
      });
    }
  };

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (newMovement) {
      setNewMovement({
        ...newMovement,
        category: { _id: event.target.value, label: "" },
      });
    }
  };
  return (
    <div className="flex flex-col gap-4 mt-2">
      <label>
        <p className="capitalize text-2xl mb-2">type</p>
        <Select
          name="type"
          id="type"
          value={newMovement?.type}
          onChange={handleChange}
          className="w-full h-9 border-navy rounded bg-green border-b-2"
        >
          {isDebt(newMovement) ? (
            <>
              <option value="debt">Debt</option>
              <option value="loan">Loan</option>
            </>
          ) : (
            <>
              <option value="income">Income</option>
              <option value="expenses">Expenses</option>
            </>
          )}
        </Select>
      </label>

      {isDebt(newMovement) ? (
        <label>
          <p className="capitalize text-2xl mb-2">entity</p>
          <input
            className="w-full h-9 px-2 border-navy bg-green border-b-2"
            id="entity"
            name="entity"
            value={
              newMovement && "entity" in newMovement
                ? newMovement?.entity
                : ""
            }
            onChange={handleChange}
            maxLength={40}
          />
        </label>
      ) : null}

      <label>
        <p className="capitalize text-2xl mb-2">
          concept {isDebt(newMovement) ? "(optional)" : ""}
        </p>
        <input
          className="w-full h-9 px-2 border-navy bg-green border-b-2"
          id="concept"
          name="concept"
          value={newMovement?.concept}
          onChange={handleChange}
          maxLength={40}
        />
      </label>

      <label>
        <p className="capitalize text-2xl mb-2">category</p>
        <Select
          name="category"
          id="category"
          value={newMovement?.category._id}
          onChange={handleChangeCategory}
          className="w-full h-9 border-navy rounded bg-green border-b-2"
        >
          <option style={{ display: "none" }}></option>
          {categories.map((elem, i) => {
            return (
              <option key={i} value={elem._id}>
                {elem.label}
              </option>
            );
          })}
        </Select>
      </label>

      <label>
        <p className="capitalize text-2xl mb-2">amount</p>
        <input
          className="w-full h-9 px-2 border-navy bg-green border-b-2"
          type="text"
          id="amount"
          name="amount"
          value={newMovement?.amount}
          onChange={handleChangeAmount}
        />
      </label>
    </div>
  );
};
