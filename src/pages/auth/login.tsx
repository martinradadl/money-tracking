import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../data/authentication";

export const Login: React.FC = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      });
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
        <button className="bg-green w-28 text-xl font-semibold py-2 rounded"
        onClick={() => {login(user)}}>
          Log in
        </button>
        <p className="text-lg">Forgot your password?</p>
        <p
          className="text-lg"
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
