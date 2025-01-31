import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  getTotalExpenses,
  getTotalIncome,
  useTransactions,
} from "../data/transactions.js";
import axios from "axios";
import { newTransaction, updatedTransaction } from "./utils.js";
import { useShallow } from "zustand/shallow";

vi.mock("axios");

describe("useTransactions", () => {
  describe("addTransaction", async () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
          }))
        )
      );
      await act(async () => {
        addTransaction(newTransaction);
      });
      expect(result.current.transactionsList).toEqual([]);
    });

    it("should return created transaction and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
          }))
        )
      );
      await act(async () => {
        addTransaction(newTransaction);
      });
      expect(result.current.transactionsList).toEqual([newTransaction]);
    });
  });

  describe("getTransactions", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
            getTransactions: state.getTransactions,
          }))
        )
      );
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
      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
            getTransactions: state.getTransactions,
          }))
        )
      );

      await act(async () => {
        result.current.getTransactions();
      });
      expect(result.current.transactionsList).toEqual([newTransaction]);
    });
  });

  describe("editTransaction", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedTransaction,
        status: 500,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
          }))
        )
      );

      await act(async () => {
        editTransaction("01", updatedTransaction);
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

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
          }))
        )
      );

      await act(async () => {
        addTransaction(newTransaction);
      });

      await act(async () => {
        editTransaction("fakeId", updatedTransaction);
      });
      expect(result.current.transactionsList).toEqual([updatedTransaction]);
    });
  });

  describe("deleteTransaction", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty transactions list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newTransaction,
        status: 200,
      });
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
          }))
        )
      );
      await act(async () => {
        addTransaction(newTransaction);
      });

      await act(async () => {
        deleteTransaction("01");
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

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            transactionsList: state.transactionsList,
          }))
        )
      );

      await act(async () => {
        addTransaction(newTransaction);
      });

      await act(async () => {
        deleteTransaction("fakeId");
      });
      expect(result.current.transactionsList).toEqual([]);
    });
  });

  describe("getTotalIncome", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should not return total income when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            totalIncome: state.totalIncome,
          }))
        )
      );

      await act(async () => {
        getTotalIncome();
      });
      expect(result.current.totalIncome).toEqual(0);
    });

    it("should return total income and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            totalIncome: state.totalIncome,
          }))
        )
      );

      await act(async () => {
        getTotalIncome();
      });
      expect(result.current.totalIncome).toEqual(100);
    });
  });

  describe("getTotalExpenses", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should not return total expenses when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            totalExpenses: state.totalExpenses,
          }))
        )
      );

      await act(async () => {
        getTotalExpenses();
      });
      expect(result.current.totalExpenses).toEqual(0);
    });

    it("should return total expenses and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useTransactions(
          useShallow((state) => ({
            totalExpenses: state.totalExpenses,
          }))
        )
      );

      await act(async () => {
        getTotalExpenses();
      });
      expect(result.current.totalExpenses).toEqual(100);
    });
  });
});
