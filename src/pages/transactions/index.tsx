import React from "react";
import { Transaction } from "./transaction";
import { transactions } from "../../data/transactions";
import AddTransactionModal from "./add-transaction";

export const Transactions: React.FC = () => {
  return (
    <div className="h-full flex flex-col px-4">
      <h1 className="mx-auto py-2 text-[2rem] text-beige">
        <b>Transactions</b>
      </h1>
      <div className="flex flex-col gap-2">
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
