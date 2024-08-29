import classNames from "classnames";
import { TransactionI } from "../../data/transactions";

interface TransactionProps {
  transaction: TransactionI;
}

export const Transaction = ({ transaction }: TransactionProps) => {
  const { type, concept, category, amount } = transaction;
  return (
    <div
      className={classNames(
        "px-2 pt-2 pb-3 flex flex-col text-[1.5rem] rounded-md gap-3 font-semibold",
        type === "income"
          ? "bg-green-pastel text-navy	ml-4"
          : "bg-red-pastel text-beige mr-4"
      )}
    >
      <p>{concept}</p>
      <div className="flex place-content-between">
        <p className="px-2 rounded-md bg-yellow-category text-navy">
          {category}
        </p>
        <p>{`${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(type === "income" ? amount : -amount)}`}</p>
      </div>
    </div>
  );
};
