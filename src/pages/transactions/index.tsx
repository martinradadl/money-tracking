import React, { useEffect } from "react";
import { Transaction } from "./transaction";
import AddTransactionModal from "./add-transaction";
import classNames from "classnames";
import { useRecoilState } from "recoil";
import {
  getBalance,
  transactionsListState,
  useTranscations,
} from "../../data/transactions";

export const Transactions: React.FC = () => {
  const [transactionsList] = useRecoilState(transactionsListState);
  const { getTransaction } = useTranscations();
  const userId = "1234";
  const balance = getBalance(transactionsList);

  useEffect(() => {
    getTransaction(userId);
  }, [userId]);

  return (
    <div className="flex flex-col flex-1 pb-14 px-4 gap-4 overflow-y-auto">
      <h1 className="mx-auto py-2 text-4xl text-beige font-semibold">
        Transactions
      </h1>
      <div className="flex w-full gap-3 pl-2 py-1 text-2xl font-semibold">
        <p className="text-beige">My Balance:</p>
        <p
          className={classNames(
            balance >= 0
              ? "bg-green-pastel text-navy"
              : "bg-red-pastel text-beige",
            "rounded px-2 py-0.5 font-semibold"
          )}
        >
          {`${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(balance)}`}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {transactionsList.map((elem, i) => {
          return <Transaction key={i} transaction={elem} />;
        })}
      </div>
      <div className="fixed bottom-[4.5rem] right-3">
        <AddTransactionModal userId={userId}/>
      </div>
    </div>
  );
};
