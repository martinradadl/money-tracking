import React from "react";

export const NavBar: React.FC = () => {
  return (
    <div className="flex place-content-between">
      <div>
        <p>Movimientos</p>
      </div>
      <div>
        <p>Perfil</p>
      </div>
    </div>
  );
};
