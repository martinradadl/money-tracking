import React from "react";
import { NavBarLink } from "./link";
import {
  AiTwotoneHome,
  AiTwotoneCreditCard,
  AiTwotoneDollarCircle,
  AiOutlineUser,
} from "react-icons/ai";

export const NavBar: React.FC = () => {
  return (
    <div className="flex mt-auto py-2 place-content-between bg-green text-navy">
      <NavBarLink
        name="Dashboard"
        icon={<AiTwotoneHome className="text-2xl" />}
        path="/"
      />
      <NavBarLink
        name="Transactions"
        icon={<AiTwotoneDollarCircle className="text-2xl" />}
        path="/transactions"
      />
      <NavBarLink
        name="Debts"
        icon={<AiTwotoneCreditCard className="text-2xl" />}
        path="/debts"
      />
      <NavBarLink
        name="Profile"
        icon={<AiOutlineUser className="text-2xl" />}
        path="/profile"
      />
    </div>
  );
};
