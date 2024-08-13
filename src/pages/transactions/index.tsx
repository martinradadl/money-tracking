import React from "react";
import { Transaction } from "./transaction";
import { transactions } from "../../data/transactions";
import AddTransactionModal from "./add-transaction";
import classNames from "classnames";

export const Transactions: React.FC = () => {
  const getBalance = () => {
    let balance = 0;
    transactions.forEach((elem) => {
      balance += elem.amount * (elem.type === "income" ? 1 : -1);
    });
    return balance;
  };

  return (
    <div className="flex flex-col flex-1 pb-3 px-4 gap-4 overflow-y-auto">
      <h1 className="mx-auto py-2 text-4xl text-beige font-semibold">
        Transactions
      </h1>
      <div className="flex w-full gap-3 pl-2 py-1 text-2xl">
        <p className="text-beige">My Balance:</p>
        <p
          className={classNames(
            getBalance() >= 0
              ? "bg-green-pastel text-navy"
              : "bg-red-pastel text-beige",
            "rounded px-2 py-0.5"
          )}
        >
          {`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getBalance())}`}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {transactions.map((elem, i) => {
          return <Transaction key={i} transaction={elem} />;
        })}
      </div>
      <div className="fixed bottom-[4.5rem] right-3">
        <AddTransactionModal />
      </div>
    </div>
  );
};
