import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../data/authentication";
import { createToastify } from "../../helpers/toastify";

export const Login: React.FC = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      });
    }
  };

  const hasEmptyFields = () => {
    return user.email === "" || user.password === "";
  };

  const handleSubmit = async () => {
    try {
      if (hasEmptyFields()) {
        createToastify({ text: "Faltan campos por llenar", type: "warning" });
      } else {
        await login(user);
        navigate("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 text-beige bg-navy h-dvh entrance-anim">
      <p className="text-3xl">Welcome!</p>
      <label className="flex flex-col gap-2">
        <p className="text-xl">Email</p>
        <input
          className="w-full h-9 px-2 border-b-2 border-green bg-navy"
          id="email"
          name="email"
          value={user?.email}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-col gap-2">
        <p className="text-xl">Password</p>
        <input
          type="password"
          className="w-full h-9 px-2 border-b-2 border-green bg-navy"
          id="password"
          name="password"
          value={user?.password}
          onChange={handleChange}
        />
      </label>
      <div className="mt-4 flex flex-col gap-2 justify-items-center items-center">
        <button
          className="bg-green w-28 text-xl font-semibold py-2 rounded"
          onClick={handleSubmit}
        >
          Log in
        </button>
        <p
          className="text-lg cursor-pointer"
          onClick={() => {
            navigate(`/forgot-password`);
          }}
        >
          Forgot your password?
        </p>
        <p
          className="text-lg cursor-pointer"
          onClick={() => {
            navigate(`/sign-up`);
          }}
        >
          Don't have an account? Sign up
        </p>
      </div>
    </div>
  );
};
