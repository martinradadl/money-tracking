import React from "react";

interface TransactionItemProps {
  label: string;
  categories: string[];
}

export const TransactionItem = ({
  label,
  categories,
}: TransactionItemProps) => {
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const onChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const onChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const getInput = () => {
    switch (label) {
      case "concept":
        return (
          <input
            id={label}
            name={label}
            className="w-full h-9 border border-navy rounded"
          />
        );
      case "amount":
        return (
          <input
            type="number"
            id={label}
            name={label}
            min="0.1"
            className="w-full h-9 border border-navy rounded"
          />
        );
      case "type":
        return (
          <select
            name={label}
            id={label}
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onChangeType(e);
            }}
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
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onChangeCategory(e);
            }}
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
