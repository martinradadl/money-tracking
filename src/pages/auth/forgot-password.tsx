import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../data/authentication";
import { createToastify } from "../../helpers/toastify";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (email === "") {
        createToastify({ text: "Faltan campos por llenar", type: "warning" });
      } else {
        await forgotPassword(email);
        navigate("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 text-beige bg-navy h-dvh entrance-anim">
      <p className="text-3xl">Forgot Password</p>
      <label className="flex flex-col gap-2">
        <p className="text-xl">Email</p>
        <input
          className="w-full h-9 px-2 border-b-2 border-green bg-navy"
          value={email}
          onChange={handleChange}
        />
      </label>
      <div className="mt-4 flex flex-col gap-2 justify-items-center items-center">
        <button
          className="bg-green w-fit text-xl font-semibold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <p
          className="text-lg"
          onClick={() => {
            navigate(`/login`);
          }}
        >
          Return to login
        </p>
      </div>
    </div>
  );
};
