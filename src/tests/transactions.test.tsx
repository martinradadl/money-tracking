import { renderHook, act } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { TransactionFormI, useTranscations } from "../data/transactions.js";
import { RecoilRoot } from "recoil";
import axios from "axios";
import React from "react";

vi.mock("axios");

export const newTransaction: TransactionFormI = {
  _id: "01",
  type: "income",
  concept: "August Salary",
  category: { _id: "66da1b9328ba43a7f62749d2", label: "Salary" },
  amount: "999",
  userId: "1234",
};

const updatedTransaction: TransactionFormI = {
  _id: "01",
  type: "income",
  concept: "September Salary",
  category: { _id: "66da1b9328ba43a7f62749d2", label: "Salary" },
  amount: "888",
  userId: "1234",
};

const category = [{ _id: "01", label: "Salary" }];

const createWrapper = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );
  return wrapper;
};

const wrapper = createWrapper();

test("addTransaction", async () => {
  vi.mocked(axios, true).post.mockResolvedValueOnce({
    data: newTransaction,
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });
  await act(async () => {
    result.current.addTransaction(newTransaction);
  });
  expect(result.current.transactionsList).toEqual([newTransaction]);
});

test("getTransaction", async () => {
  vi.mocked(axios, true).get.mockResolvedValueOnce({
    data: [newTransaction],
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });

  await act(async () => {
    result.current.getTransactions("1234");
  });
  expect(result.current.transactionsList).toEqual([newTransaction]);
});

test("editTransaction", async () => {
  vi.mocked(axios, true).post.mockResolvedValueOnce({
    data: newTransaction,
  });
  vi.mocked(axios, true).put.mockResolvedValueOnce({
    data: updatedTransaction,
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });

  await act(async () => {
    result.current.addTransaction(newTransaction);
  });

  await act(async () => {
    result.current.editTransaction("01", updatedTransaction);
  });
  expect(result.current.transactionsList).toEqual([updatedTransaction]);
});

test("deleteTransaction", async () => {
  vi.mocked(axios, true).post.mockResolvedValueOnce({
    data: newTransaction,
  });
  vi.mocked(axios, true).delete.mockResolvedValueOnce({});

  const { result } = renderHook(() => useTranscations(), { wrapper });

  await act(async () => {
    result.current.addTransaction(newTransaction);
  });

  await act(async () => {
    result.current.deleteTransaction("01");
  });
  expect(result.current.transactionsList).toEqual([]);
});

test("getCategories", async () => {
  vi.mocked(axios, true).get.mockResolvedValueOnce({
    data: [category],
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });

  await act(async () => {
    result.current.getCategories();
  });
  expect(result.current.categories).toEqual([category]);
});

test("getBalance", async () => {
  vi.mocked(axios, true).get.mockResolvedValueOnce({
    data: 100,
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });

  await act(async () => {
    result.current.getBalance("1234");
  });
  expect(result.current.balance).toEqual(100);
});
