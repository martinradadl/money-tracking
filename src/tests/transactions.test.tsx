import { renderHook, act } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { firstTransaction, useTranscations } from "../data/transactions.js";
import { RecoilRoot } from "recoil";
import axios from "axios";
import React from "react";

vi.mock("axios");

const newTransaction = {
  _id: "02",
  type: "outcome",
  concept: "Bought new phone",
  category: "Tech",
  amount: 345,
  userId: "1234",
};

const updatedTransaction = {
  _id: "01",
  type: "income",
  concept: "September Salary",
  category: "Salary",
  amount: 888,
  userId: "1234",
};

const createWrapper = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );
  return wrapper;
};

test("addTransaction", async () => {
  const wrapper = createWrapper();

  vi.mocked(axios, true).post.mockResolvedValueOnce({
    data: newTransaction,
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });
  await act(async () => {
    result.current.addTransaction(newTransaction);
  });
  expect(result.current.transactionsList).toEqual([
    firstTransaction,
    newTransaction,
  ]);
});

test("getTransaction", async () => {
  const wrapper = createWrapper();

  vi.mocked(axios, true).get.mockResolvedValueOnce({
    data: [firstTransaction],
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });
  await act(async () => {
    result.current.getTransactions("1234");
  });
  expect(result.current.transactionsList).toEqual([firstTransaction]);
});

test("editTransaction", async () => {
  const wrapper = createWrapper();

  vi.mocked(axios, true).put.mockResolvedValueOnce({
    data: updatedTransaction,
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });
  await act(async () => {
    result.current.editTransaction("01", updatedTransaction);
  });
  expect(result.current.transactionsList).toEqual([updatedTransaction]);
});

test("deleteTransaction", async () => {
  const wrapper = createWrapper();

  vi.mocked(axios, true).delete.mockResolvedValueOnce({
    data: [],
  });

  const { result } = renderHook(() => useTranscations(), { wrapper });
  await act(async () => {
    result.current.deleteTransaction("01");
  });
  expect(result.current.transactionsList).toEqual([]);
});
