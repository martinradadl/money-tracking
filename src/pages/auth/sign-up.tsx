import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../data/authentication";
import { createToastify } from "../../helpers/toastify";

export const SignUp: React.FC = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      });
    }
  };

  const hasEmptyFields = () => {
    return user.name === "" || user.email === "" || user.password === "";
  };

  const handleSubmit = async () => {
    try {
      if (hasEmptyFields()) {
        createToastify({ text: "Faltan campos por llenar", type: "warning" });
      } else {
        const parsedUser = {
          ...user,
          currency: { name: "Colombian Peso", code: "COP" },
        };
        await register(parsedUser);
        navigate("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 text-beige bg-navy h-dvh entrance-anim">
      <p className="text-3xl">Welcome!</p>
      <label className="flex flex-col gap-2">
        <p className="text-xl">Name</p>
        <input
          className="w-full h-9 px-2 border-b-2 border-green bg-navy"
          id="name"
          name="name"
          value={user?.name}
          onChange={handleChange}
        />
      </label>
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
          Sign Up
        </button>
        <p
          className="text-lg cursor-pointer"
          onClick={() => {
            navigate(`/login`);
          }}
        >
          Already have an account? Sign in
        </p>
      </div>
    </div>
  );
};
