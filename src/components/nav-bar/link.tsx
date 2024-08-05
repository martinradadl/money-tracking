import React from "react";
import { Link } from "react-router-dom";

interface NavBarLinkProps {
  name: string;
  icon: React.ReactNode;
  path: string;
}

export const NavBarLink = ({ name, icon, path }: NavBarLinkProps) => {
  return (
    <Link
      className="flex flex-1 flex-col items-center justify-center"
      to={path}
    >
      {icon}
      <p className="text-[0.75rem]">{name}</p>
    </Link>
  );
};
