import classNames from "classnames";

interface props {
  isIncomeOrLoan?: boolean;
}

export const CardSkeleton = ({ isIncomeOrLoan }: props) => {
  return (
    <div
      className={classNames(
        "flex flex-col p-4 gap-4 rounded-md animate-pulse",
        isIncomeOrLoan ? "bg-green-pastel ml-4" : "bg-red-pastel mr-4"
      )}
    >
      <div className="h-2 w-1/3 rounded bg-beige" />
      <div className="flex flex-col gap-3">
        <div className="h-2 w-1/2 rounded bg-beige" />
        <div className="h-2 w-3/4 rounded bg-beige" />
        <div className="h-2 w-1/4 rounded bg-beige" />
      </div>
      <div className="flex place-content-between items-center">
        <div className="h-6 w-1/5 rounded-md bg-beige" />
        <div className="h-2 w-1/5 rounded bg-beige" />
      </div>
    </div>
  );
};
