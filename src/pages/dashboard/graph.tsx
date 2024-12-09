import { Select } from "@headlessui/react";
import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Graph } from "../../components/graphs/graph";
import { useNavigate } from "react-router-dom";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const GraphPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const navigate = useNavigate();

  const handleChangeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event?.target.value);
  };

  return (
    <div className="px-3 py-3 overflow-auto flex flex-col gap-2">
      <div>
        <AiOutlineArrowLeft
          className="text-3xl text-beige cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>

      <Select
        name="month"
        id="month"
        value={selectedMonth}
        onChange={handleChangeMonth}
        className="w-full text-xl rounded bg-beige text-navy border-b-2"
      >
        {months.map((elem, i) => {
          return (
            <option key={i} value={elem}>
              {elem}
            </option>
          );
        })}
      </Select>

      <Graph />
    </div>
  );
};
