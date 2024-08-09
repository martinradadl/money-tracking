import React from "react";
import { Transaction } from "./transaction";
import { transactions } from "../../data/transactions";

export const Transactions: React.FC = () => {
  return (
    <div className="flex flex-col px-4 red">
      <h1 className="m-auto py-2 text-[2rem] text-beige">
        <b>Transactions</b>
      </h1>
      <div className="flex flex-col gap-2">
        {transactions.map((elem, i) => {
          return <Transaction key={i} transaction={elem} />;
        })}
      </div>
    </div>
  );
};
