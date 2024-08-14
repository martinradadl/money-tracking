import React from "react";
import { useRecoilState } from "recoil";
import { newTransactionState } from "../../data/transactions";

interface TransactionItemProps {
  label: string;
  categories: string[];
}

export const TransactionItem = ({
  label,
  categories,
}: TransactionItemProps) => {
  const [newTransaction, setNewTransaction] =
    useRecoilState(newTransactionState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({
      ...newTransaction,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTransaction({
      ...newTransaction,
      [event.target.name]: event.target.value,
    });
  };

  const getInput = () => {
    switch (label) {
      case "concept":
        return (
          <input
            className="w-full h-9 px-2 border border-navy rounded"
            id={label}
            name={label}
            value={newTransaction.concept}
            onChange={handleChange}
          />
        );
      case "amount":
        return (
          <input
            className="w-full h-9 px-2 border border-navy rounded"
            type="number"
            id={label}
            name={label}
            min="0.1"
            value={newTransaction.amount}
            onChange={handleChange}
          />
        );
      case "type":
        return (
          <select
            name={label}
            id={label}
            value={newTransaction.type}
            onChange={handleChangeSelect}
            className="w-full h-9 border border-navy rounded"
          >
            <option value="income">Income</option>
            <option value="expenses">Expenses</option>
          </select>
        );
      case "category":
        return (
          <select
            name={label}
            id={label}
            value={newTransaction.category}
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
        );
    }
  };

  return (
    <label>
      <p className="capitalize text-2xl mb-2">{label}</p>
      {getInput()}
    </label>
  );
};
