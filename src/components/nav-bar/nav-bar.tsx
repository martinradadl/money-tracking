import React from "react";
import { NavBarLink } from "./link";
import {
  AiTwotoneHome,
  AiTwotoneCreditCard,
  AiTwotoneDollar,
  AiOutlineUser,
} from "react-icons/ai";

export const NavBar: React.FC = () => {
  return (
    <div className="flex mt-auto mb-3 place-content-between">
      <NavBarLink
        name="Dashboard"
        icon={<AiTwotoneHome className="text-2xl" />}
        path="/"
      />
      <NavBarLink
        name="Movimientos"
        icon={<AiTwotoneDollar className="text-2xl" />}
        path="/transactions"
      />
      <NavBarLink
        name="Deudas"
        icon={<AiTwotoneCreditCard className="text-2xl" />}
        path="/debts"
      />
      <NavBarLink
        name="Perfil"
        icon={<AiOutlineUser className="text-2xl" />}
        path="/profile"
      />
    </div>
  );
};
