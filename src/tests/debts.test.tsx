import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { createWrapper, newDebt, updatedDebt } from "./utils.js";
import { useDebts } from "../data/debts.js";

vi.mock("axios");

const wrapper = createWrapper(true);

describe("useDebts", () => {
  describe("addDebt", async () => {
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });
      await act(async () => {
        result.current.addDebt(newDebt);
      });
      expect(result.current.debtsList).toEqual([]);
    });

    it("should return created debts and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });
      await act(async () => {
        result.current.addDebt(newDebt);
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });
  });

  describe("getDebts", () => {
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });
      await act(async () => {
        result.current.getDebts();
      });
      expect(result.current.debtsList).toEqual([]);
    });

    it("should return debts list with elements and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [newDebt],
        status: 200,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });

      await act(async () => {
        result.current.getDebts();
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });
  });

  describe("editDebt", () => {
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedDebt,
        status: 500,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });
      await act(async () => {
        result.current.addDebt(newDebt);
      });

      await act(async () => {
        result.current.editDebt("01", updatedDebt);
      });
      expect(result.current.debtsList).toEqual([]);
    });

    it("should return updated debt and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedDebt,
        status: 200,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });

      await act(async () => {
        result.current.addDebt(newDebt);
      });

      await act(async () => {
        result.current.editDebt("01", updatedDebt);
      });
      expect(result.current.debtsList).toEqual([updatedDebt]);
    });
  });

  describe("deleteDebt", () => {
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });
      await act(async () => {
        result.current.addDebt(newDebt);
      });

      await act(async () => {
        result.current.deleteDebt("01");
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });

    it("should delete debt and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 200,
      });

      const { result } = renderHook(() => useDebts(), { wrapper });

      await act(async () => {
        result.current.addDebt(newDebt);
      });

      await act(async () => {
        result.current.deleteDebt("fakeId");
      });
      expect(result.current.debtsList).toEqual([]);
    });
  });
});
