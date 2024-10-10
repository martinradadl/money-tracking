import { renderHook, act } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
import axios from "axios";
import { checkPassword, useAuth } from "../data/authentication";
import {
  createWrapper,
  currencies,
  loggedUser,
  newUser,
  updatedUser,
} from "./utils";

vi.mock("axios");

const wrapper = createWrapper(false);

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
        data: { user: newUser },
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
        data: { user: newUser },
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

  describe("change password", async () => {
    it("Should not change password", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        if (newUser._id && updatedUser.password) {
          result.current.changePassword(newUser._id, updatedUser.password);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should return updated User and statusCode 200", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: { ...newUser, password: updatedUser.password },
        status: 200,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        if (newUser._id && updatedUser.password) {
          result.current.changePassword(newUser._id, updatedUser.password);
        }
      });
      expect(result.current.user).toEqual({
        ...newUser,
        password: updatedUser.password,
      });
    });
  });

  describe("get currencies", () => {
    it("should not return currencies when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.getCurrencies();
      });
      expect(result.current.currencies).toEqual([]);
    });

    it("should return currencies and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: currencies,
        status: 200,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.getCurrencies();
      });
      expect(result.current.currencies).toEqual(currencies);
    });
  });

  describe("check password", () => {
    it("should not return password check when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      if (newUser._id && newUser.password)
        expect(await checkPassword(newUser._id, newUser.password)).toBe(
          undefined
        );
    });

    it("should return true and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: true,
        status: 200,
      });
      if (newUser._id && newUser.password)
        expect(await checkPassword(newUser._id, newUser.password)).toBe(true);
    });
  });
});
