import React from "react";
import { useRecoilState } from "recoil";
import { categoriesState, newTransactionState } from "../../data/transactions";
import { Select } from "@headlessui/react";

export const TransactionForm = () => {
  const [newTransaction, setNewTransaction] =
    useRecoilState(newTransactionState);

  const [categories] = useRecoilState(categoriesState);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (newTransaction) {
      setNewTransaction({
        ...newTransaction,
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
      newTransaction &&
      inputValue.length <= 12 &&
      (!lastValue || hasAllowedValues) &&
      firstValue !== "0"
    ) {
      setNewTransaction({
        ...newTransaction,
        [event.target.name]: inputValue,
      });
    }
  };

  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (newTransaction) {
      setNewTransaction({
        ...newTransaction,
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
          value={newTransaction?.type}
          onChange={handleChange}
          className="w-full h-9 border-navy rounded bg-green border-b-2"
        >
          <option value="income">Income</option>
          <option value="expenses">Expenses</option>
        </Select>
      </label>
      <label>
        <p className="capitalize text-2xl mb-2">concept</p>
        <input
          className="w-full h-9 px-2 border-navy bg-green border-b-2"
          id="concept"
          name="concept"
          value={newTransaction?.concept}
          onChange={handleChange}
          maxLength={40}
        />
      </label>
      <label>
        <p className="capitalize text-2xl mb-2">category</p>
        <Select
          name="category"
          id="category"
          value={newTransaction?.category._id}
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
          value={newTransaction?.amount}
          onChange={handleChangeAmount}
        />
      </label>
    </div>
  );
};
