import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, useAuth } from "../../data/authentication";
import { createToastify } from "../../helpers/toastify";
import { Select } from "@headlessui/react";
import { useShallow } from "zustand/shallow";

export const SignUp: React.FC = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    currency: { name: "Colombian Peso", code: "COP" },
    timezone: { name: "CO - Colombia - America/Bogota", offset: "-05:00" },
    profilePic: "",
  });
  const { currencies, timezones } = useAuth(
    useShallow((state) => ({
      currencies: state.currencies,
      timezones: state.timezones,
    }))
  );
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({
        ...user,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleChangeCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const currencySplitted = event.target.value.split(" - ");
    setUser({
      ...user,
      currency: { name: currencySplitted[0], code: currencySplitted[1] },
    });
  };

  const handleChangeTimeZone = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const timezoneSplitted = event.target.value.split(" | ");
    setUser({
      ...user,
      timezone: { name: timezoneSplitted[0], offset: timezoneSplitted[1] },
    });
  };

  const hasEmptyFields = () => {
    return user.name === "" || user.email === "" || user.password === "";
  };

  const handleSubmit = async () => {
    try {
      if (hasEmptyFields()) {
        createToastify({ text: "Faltan campos por llenar", type: "warning" });
      } else {
        await register(user);
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
      <label>
        <p className="text-2xl mb-2">Currency</p>
        <Select
          name="currency"
          id="currency"
          value={`${user.currency.name} - ${user.currency.code}`}
          onChange={handleChangeCurrency}
          className="w-full h-9 border-green rounded bg-navy border-b-2"
        >
          {currencies.map((elem, i) => {
            return (
              <option key={i} value={`${elem.name} - ${elem.code}`}>
                {`${elem.name} - ${elem.code}`}
              </option>
            );
          })}
        </Select>
      </label>

      <label>
        <p className="text-2xl mb-2">Time Zone</p>
        <Select
          name="timezone"
          id="timezone"
          value={`${user.timezone.name} | ${user.timezone.offset}`}
          onChange={handleChangeTimeZone}
          className="w-full h-9 border-green rounded bg-navy border-b-2"
        >
          {timezones.map((elem, i) => {
            return (
              <option key={i} value={`${elem.name} | ${elem.offset}`}>
                {`${elem.name} | ${elem.offset}`}
              </option>
            );
          })}
        </Select>
      </label>
      <div className="mt-4 flex flex-col gap-2 justify-items-center items-center">
        <button
          className="bg-green w-28 text-xl font-semibold py-2 rounded"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        <p
          className="text-lg cursor-pointer mb-5"
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
