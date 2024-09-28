import { renderHook, act } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
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

describe("useAuthentication", () => {
  describe("register", async () => {
    it("should return user as null when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        result.current.register(newUser);
      });
      expect(result.current.user).toEqual(null);
    });

    it("should return created user and statusCode 200", async () => {
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
  });

  describe("login", async () => {
    it("should return user as null when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        result.current.login(loggedUser);
      });
      expect(result.current.user).toEqual(null);
    });

    it("should return 200 and logged user", async () => {
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
  });

  describe("edit user", async () => {
    it("Should not update User", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        if (newUser._id) {
          result.current.editUser(newUser._id, updatedUser);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should return updated User and statusCode 200", async () => {
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
  });

  describe("delete user", async () => {
    it("Should not delete User", async () => {
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        if (newUser._id) {
          result.current.deleteUser(newUser._id);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should delete User", async () => {
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
  });
});
