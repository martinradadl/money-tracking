import { renderHook, act } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RecoilRoot } from "recoil";
import axios from "axios";
import React from "react";
import { LoginI, useAuth, UserI } from "../data/authentication";

vi.mock("axios");

export const newUser: UserI = {
  _id: "fakeId",
  name: "fakeName",
  email: "fakeEmail",
  password: "fakePassword",
};

export const updatedUser: UserI = {
  _id: "fakeId",
  name: "fakeUpdatedName",
  email: "fakeUpdatedEmail",
  password: "fakeUpdatedPassword",
};

export const loggedUser: LoginI = {
  email: "fakeEmail",
  password: "fakePassword",
};

const createWrapper = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );
  return wrapper;
};

const wrapper = createWrapper();

test("register", async () => {
  vi.mocked(axios, true).post.mockResolvedValueOnce({
    data: newUser,
    status: 200,
  });

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    result.current.register(newUser);
  });
  expect(result.current.user).toEqual(newUser);
});

test("login", async () => {
  vi.mocked(axios, true).post.mockResolvedValueOnce({
    data: newUser,
    status: 200,
  });

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    result.current.login(loggedUser);
  });
  expect(result.current.user).toEqual(newUser);
});

test("editUser", async () => {
  vi.mocked(axios, true).put.mockResolvedValueOnce({
    data: updatedUser,
    status: 200,
  });

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    if (newUser._id) {
      result.current.editUser(newUser._id, updatedUser);
    }
  });
  expect(result.current.user).toEqual(updatedUser);
});

test("deleteUser", async () => {
  vi.mocked(axios, true).delete.mockResolvedValueOnce({
    status: 200,
  });

  const { result } = renderHook(() => useAuth(), { wrapper });
  await act(async () => {
    if (newUser._id) {
      result.current.deleteUser(newUser._id);
    }
  });
  expect(result.current.user).toEqual(null);
});
