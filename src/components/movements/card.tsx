import classNames from "classnames";
import { TransactionI } from "../../data/transactions";
import { getCurrencyFormat } from "../../helpers/currency";
import { CurrencyI } from "../../data/authentication";
import { DebtI } from "../../data/debts";

interface TransactionProps {
  content: TransactionI | DebtI;
  currency?: CurrencyI;
}

export const Card = ({ content, currency }: TransactionProps) => {
  const { type, concept, category, amount } = content;

  return (
    <div
      className={classNames(
        "px-2 pt-2 pb-3 flex flex-col text-[1.5rem] rounded-md gap-3 font-semibold",
        type === "income" || type === "loan"
          ? "bg-green-pastel text-navy	ml-4"
          : "bg-red-pastel text-beige mr-4"
      )}
    >
      <div className="flex flex-col gap-1">
        <p>
          {"entity" in content
            ? type === "loan"
              ? `${content.entity} owes you`
              : `You owe to ${content.entity}`
            : concept}
        </p>
        <p className="text-xl">{"entity" in content ? concept : null}</p>
      </div>

      <div
        className={classNames(
          "flex ",
          category.label !== "N/A" ? "place-content-between" : "justify-end"
        )}
      >
        {category.label !== "N/A" ? (
          <p className="px-2 rounded-md bg-yellow-category text-navy">
            {category.label}{" "}
          </p>
        ) : null}

        {currency ? (
          <p>
            {getCurrencyFormat({
              currency,
              amount: type === "income" || type === "loan" ? amount : -amount,
            })}
          </p>
        ) : null}
      </div>
    </div>
  );
};
