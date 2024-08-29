import React from "react";
import { useRecoilState } from "recoil";
import { newTransactionState } from "../../data/transactions";


const categories: string[] = [
  "Salary",
  "Food",
  "Transport",
  "Entertainment",
  "Sellings",
  "Tech",
];

export const TransactionForm = () => {
  const [newTransaction, setNewTransaction] =
    useRecoilState(newTransactionState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (newTransaction) {
      setNewTransaction({
        ...newTransaction,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (newTransaction) {
      setNewTransaction({
        ...newTransaction,
        [event.target.name]: event.target.value,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <label>
        <p className="capitalize text-2xl mb-2">type</p>
        <select
            name="type"
            id="type"
            value={newTransaction?.type}
            onChange={handleChangeSelect}
            className="w-full h-9 border border-navy rounded"
          >
            <option value="income">Income</option>
            <option value="expenses">Expenses</option>
          </select>
      </label>
      <label>
        <p className="capitalize text-2xl mb-2">concept</p>
        <input
            className="w-full h-9 px-2 border border-navy rounded"
            id="concept"
            name="concept"
            value={newTransaction?.concept}
            onChange={handleChange}
          />
      </label>
      <label>
        <p className="capitalize text-2xl mb-2">category</p>
        <select
            name="category"
            id="category"
            value={newTransaction?.category}
            onChange={handleChangeSelect}
            className="w-full h-9 border border-navy rounded"
          >
            <option style={{ display: "none" }}></option>
            {categories.map((elem, i) => {
              return (
                <option key={i} value={elem}>
                  {elem}
                </option>
              );
            })}
          </select>
      </label>
      <label>
        <p className="capitalize text-2xl mb-2">amount</p>
        <input
            className="w-full h-9 px-2 border border-navy rounded"
            type="number"
            id="amount"
            name="amount"
            min="0.1"
            value={newTransaction?.amount}
            onChange={handleChange}
          />
      </label>
    </div>
  );
};
