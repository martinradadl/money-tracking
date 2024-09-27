import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const [cookies] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.user) {
      navigate(`/login`);
    }
  }, []);

  return <h1>Dashboard</h1>;
};
