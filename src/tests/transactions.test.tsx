import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTransactions } from "../data/transactions.js";
import axios from "axios";
import { createWrapper, newTransaction, updatedTransaction } from "./utils.js";

vi.mock("axios");

const wrapper = createWrapper(true);

describe("useTransactions", () => {
  describe("addTransaction", async () => {
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await act(async () => {
        result.current.addTransaction(newTransaction);
      });
      expect(result.current.transactionsList).toEqual([]);
    });

    it("should return created transaction and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await act(async () => {
        result.current.addTransaction(newTransaction);
      });
      expect(result.current.transactionsList).toEqual([newTransaction]);
    });
  });

  describe("getTransactions", () => {
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await act(async () => {
        result.current.getTransactions();
      });
      expect(result.current.transactionsList).toEqual([]);
    });

    it("should return transactions list with elements and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [newTransaction],
        status: 200,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });

      await act(async () => {
        result.current.getTransactions();
      });
      expect(result.current.transactionsList).toEqual([newTransaction]);
    });
  });

  describe("editTransaction", () => {
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedTransaction,
        status: 500,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await act(async () => {
        result.current.addTransaction(newTransaction);
      });

      await act(async () => {
        result.current.editTransaction("01", updatedTransaction);
      });
      expect(result.current.transactionsList).toEqual([]);
    });

    it("should return updated transaction and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedTransaction,
        status: 200,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });

      await act(async () => {
        result.current.addTransaction(newTransaction);
      });

      await act(async () => {
        result.current.editTransaction("fakeId", updatedTransaction);
      });
      expect(result.current.transactionsList).toEqual([updatedTransaction]);
    });
  });

  describe("deleteTransaction", () => {
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await act(async () => {
        result.current.addTransaction(newTransaction);
      });

      await act(async () => {
        result.current.deleteTransaction("01");
      });
      expect(result.current.transactionsList).toEqual([newTransaction]);
    });

    it("should delete transaction and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 200,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });

      await act(async () => {
        result.current.addTransaction(newTransaction);
      });

      await act(async () => {
        result.current.deleteTransaction("fakeId");
      });
      expect(result.current.transactionsList).toEqual([]);
    });
  });

  describe("getBalance", () => {
    it("should not return balance when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });

      await act(async () => {
        result.current.getBalance();
      });
      expect(result.current.balance).toEqual(0);
    });

    it("should return balance and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() => useTransactions(), { wrapper });

      await act(async () => {
        result.current.getBalance();
      });
      expect(result.current.balance).toEqual(100);
    });
  });
});
