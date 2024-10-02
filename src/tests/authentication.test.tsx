import { renderHook, act } from "@testing-library/react";
import { expect, vi, describe, it } from "vitest";
import axios from "axios";
import { useAuth } from "../data/authentication";
import { createWrapper, loggedUser, newUser, updatedUser } from "./utils";

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
          result.current.editUser(newUser._id, updatedUser, "token");
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
          result.current.editUser(newUser._id, updatedUser, "token");
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
