import classNames from "classnames";
import React from "react";
import { TransactionI } from "../../data/transactions";

interface TransactionProps {
  transaction: TransactionI;
}

export const Transaction = ({ transaction }: TransactionProps) => {
  const { type, concept, category, amount } = transaction;
  return (
    <div
      className={classNames(
        "p-1 flex flex-col text-[1.5rem] rounded-md gap-1 font-semibold",
        type === "income"
          ? "bg-green-pastel text-navy	ml-4"
          : "bg-red-pastel text-beige mr-4"
      )}
    >
      <p>{concept}</p>
      <div className="flex place-content-between">
        <p className="px-1 rounded-md bg-yellow-category text-navy">
          {category}
        </p>
        <p>{`${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(type === "income" ? amount : -amount)}`}</p>
      </div>
    </div>
  );
};
