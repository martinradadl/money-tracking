import classNames from "classnames";
import { TransactionI } from "../../data/transactions";
import { getCurrencyFormat } from "../../helpers/currency";
import { CurrencyI } from "../../data/authentication";

interface TransactionProps {
  transaction: TransactionI;
  currency?: CurrencyI;
}

export const Transaction = ({ transaction, currency }: TransactionProps) => {
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
          {category.label}
        </p>
        {currency ? (
          <p>
            {getCurrencyFormat({
              currency,
              amount: type === "income" ? amount : -amount,
            })}
          </p>
        ) : null}
      </div>
    </div>
  );
};
