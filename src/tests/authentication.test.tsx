import { renderHook, act } from "@testing-library/react";
import { expect, vi, describe, it, afterAll } from "vitest";
import axios from "axios";
import {
  changePassword,
  checkPassword,
  deleteUser,
  editUser,
  forgotPassword,
  getCurrencies,
  login,
  register,
  resetPassword,
  useAuth,
} from "../data/authentication";
import {
  currencies,
  fakeToken,
  loggedUser,
  newUser,
  updatedUser,
} from "./utils";
import * as createToastify from "../helpers/toastify";
import { useShallow } from "zustand/shallow";

vi.mock("axios");

describe("useAuthentication", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  describe("register", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("should return user as null when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        register(newUser);
      });
      expect(result.current.user).toEqual(null);
    });

    it("should return created user and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: { user: newUser },
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        register(newUser);
      });
      expect(result.current.user).toEqual(newUser);
    });
  });

  describe("login", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("should return user as null when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        login(loggedUser);
      });
      expect(result.current.user).toEqual(null);
    });

    it("should return 200 and logged user", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: { user: newUser },
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        login(loggedUser);
      });
      expect(result.current.user).toEqual(newUser);
    });
  });

  describe("edit user", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("Should not update User", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        if (newUser._id) {
          editUser(newUser._id, updatedUser);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should return updated User and statusCode 200", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedUser,
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        if (newUser._id) {
          editUser(newUser._id, updatedUser);
        }
      });
      expect(result.current.user).toEqual(updatedUser);
    });
  });

  describe("delete user", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("Should not delete User", async () => {
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        if (newUser._id) {
          deleteUser(newUser._id);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should delete User", async () => {
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        if (newUser._id) {
          deleteUser(newUser._id);
        }
      });
      expect(result.current.user).toEqual(null);
    });
  });

  describe("change password", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("Should not change password", async () => {
      vi.mocked(axios, true).mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        if (newUser._id && updatedUser.password) {
          changePassword(newUser._id, updatedUser.password);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should return updated User and statusCode 200", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: { ...newUser, password: updatedUser.password },
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        changePassword(newUser._id || "", updatedUser.password || "");
      });
      expect(result.current.user).toEqual({
        ...newUser,
        password: updatedUser.password,
      });
    });
  });

  describe("reset password", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("Should return error", async () => {
      vi.mocked(axios, true).mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        if (newUser._id && updatedUser.password) {
          resetPassword(newUser._id, updatedUser.password, fakeToken);
        }
      });
      expect(result.current.user).toEqual(null);
    });

    it("Should return updated User and statusCode 200", async () => {
      vi.mocked(axios, true).mockResolvedValueOnce({
        data: { ...newUser, password: updatedUser.password },
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            user: state.user,
          }))
        )
      );
      await act(async () => {
        resetPassword(
          newUser?._id || "",
          updatedUser?.password || "",
          fakeToken
        );
      });
      expect(result.current.user).toEqual({
        ...newUser,
        password: updatedUser.password,
      });
    });
  });

  describe("forgot password", async () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("Should return error", async () => {
      const err = new Error("error");
      vi.mocked(axios, true).get.mockImplementation(() => {
        throw err;
      });
      const spy = vi.spyOn(createToastify, "createToastify");
      await act(async () => {
        forgotPassword(newUser.email);
      });
      expect(spy).toHaveBeenCalledWith({
        text: err.message,
        type: "error",
      });
    });

    it("Should return message that email was sent and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 200,
        data: { message: "fakeMessage" },
      });
      const spy = vi.spyOn(createToastify, "createToastify");

      await act(async () => {
        forgotPassword(newUser.email);
      });
      expect(spy).toHaveBeenCalledWith({
        text: "fakeMessage",
        type: "success",
      });
    });
  });

  describe("get currencies", () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

    it("should not return currencies when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            currencies: state.currencies,
          }))
        )
      );

      await act(async () => {
        getCurrencies();
      });
      expect(result.current.currencies).toEqual([]);
    });

    it("should return currencies and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: currencies,
        status: 200,
      });

      const { result } = renderHook(() =>
        useAuth(
          useShallow((state) => ({
            currencies: state.currencies,
          }))
        )
      );

      await act(async () => {
        getCurrencies();
      });
      expect(result.current.currencies).toEqual(currencies);
    });
  });

  describe("check password", () => {
    afterAll(() => {
      vi.resetAllMocks();
    });

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
