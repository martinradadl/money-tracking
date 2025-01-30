import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../data/authentication";
import { createToastify } from "../../helpers/toastify";

export const ResetPassword = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState({ new: "", confirm: "" });
  const navigate = useNavigate();
  const userId = params.get("userId");
  const token = params.get("token");

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (password.new === "" || password.confirm === "") {
        createToastify({ text: "Faltan campos por llenar", type: "warning" });
      } else if (password.new !== password.confirm) {
        createToastify({
          text: "Confirmed password does not match with new password",
          type: "warning",
        });
      } else if (password.confirm.length < 6) {
        createToastify({
          text: "Password must have at least 6 characters",
          type: "warning",
        });
      } else {
        if (userId && token) {
          await resetPassword(userId, password.confirm, token);
          navigate("/login");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 text-beige bg-navy h-dvh entrance-anim">
      <p className="text-3xl">Welcome Back!</p>
      <label className="flex flex-col gap-2">
        <p className="text-xl">New Password</p>
        <input
          type="password"
          className="w-full h-9 px-2 border-b-2 border-green bg-navy"
          id="new"
          name="new"
          value={password.new}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-col gap-2">
        <p className="text-xl">Confirm Password</p>
        <input
          type="password"
          className="w-full h-9 px-2 border-b-2 border-green bg-navy"
          id="confirm"
          name="confirm"
          value={password.confirm}
          onChange={handleChange}
        />
      </label>
      <div className="mt-4 flex flex-col justify-items-center items-center">
        <button
          className="bg-green w-fit text-xl font-semibold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};
