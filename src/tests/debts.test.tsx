import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import {
  fakeDebtChartData,
  fakeDebtChartData2,
  newDebt,
  updatedDebt,
} from "./utils.js";
import {
  addDebt,
  deleteDebt,
  editDebt,
  getDebts,
  getDebtsChartData,
  getTotalDebts,
  getTotalLoans,
  useDebts,
} from "../data/debts.js";
import { useShallow } from "zustand/shallow";
import { timePeriods } from "../helpers/movements.js";

vi.mock("axios");

describe("useDebts", () => {
  describe("addDebt", async () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );
      await act(async () => {
        addDebt(newDebt);
      });
      expect(result.current.debtsList).toEqual([]);
    });

    it("should return created debts and statusCode 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );
      await act(async () => {
        addDebt(newDebt);
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });
  });

  describe("getDebts", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );
      await act(async () => {
        getDebts({});
      });
      expect(result.current.debtsList).toEqual([]);
    });

    it("should return debts list with elements and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [newDebt],
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );

      await act(async () => {
        getDebts({});
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });

    it("should return debts list with elements in a selected date and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [newDebt],
        status: 200,
      });
      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );

      await act(async () => {
        getDebts({
          timePeriod: timePeriods.day,
          date: "2020/02/02",
        });
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });

    it("should return debts list with elements in a selected date range and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [newDebt],
        status: 200,
      });
      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );

      await act(async () => {
        getDebts({
          timePeriod: timePeriods.day,
          startDate: "2020/02/02",
          endDate: "2020/02/20",
        });
      });
      expect(result.current.debtsList).toEqual([newDebt]);
    });
  });

  describe("getChartData", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty debts chart data list when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsChartDataList: state.debtsChartDataList,
          }))
        )
      );
      await act(async () => {
        getDebtsChartData({});
      });
      expect(result.current.debtsChartDataList).toEqual([]);
    });

    it("should return debts chart data list with elements and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [fakeDebtChartData, fakeDebtChartData2],
        status: 200,
      });
      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsChartDataList: state.debtsChartDataList,
          }))
        )
      );

      await act(async () => {
        getDebtsChartData({});
      });
      expect(result.current.debtsChartDataList).toEqual([
        fakeDebtChartData,
        fakeDebtChartData2,
      ]);
    });

    it("should return debts chart data list with elements in a selected date and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [fakeDebtChartData],
        status: 200,
      });
      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsChartDataList: state.debtsChartDataList,
          }))
        )
      );

      await act(async () => {
        getDebtsChartData({
          timePeriod: timePeriods.day,
          date: "2020/02/02",
        });
      });
      expect(result.current.debtsChartDataList).toEqual([fakeDebtChartData]);
    });

    it("should return debts list with elements in a selected date range and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: [fakeDebtChartData],
        status: 200,
      });
      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsChartDataList: state.debtsChartDataList,
          }))
        )
      );

      await act(async () => {
        getDebtsChartData({
          timePeriod: timePeriods.day,
          startDate: "2020/02/02",
          endDate: "2020/02/20",
        });
      });
      expect(result.current.debtsChartDataList).toEqual([fakeDebtChartData]);
    });
  });

  describe("editDebt", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).put.mockResolvedValueOnce({
        data: updatedDebt,
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );

      await act(async () => {
        editDebt("01", updatedDebt);
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

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );

      await act(async () => {
        addDebt(newDebt);
      });

      await act(async () => {
        editDebt("fakeId", updatedDebt);
      });
      expect(result.current.debtsList).toEqual([updatedDebt]);
    });
  });

  describe("deleteDebt", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should return empty debts list when status is not 200", async () => {
      vi.mocked(axios, true).post.mockResolvedValueOnce({
        data: newDebt,
        status: 200,
      });
      vi.mocked(axios, true).delete.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );
      await act(async () => {
        addDebt(newDebt);
      });

      await act(async () => {
        deleteDebt("01");
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

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            debtsList: state.debtsList,
          }))
        )
      );

      await act(async () => {
        addDebt(newDebt);
      });

      await act(async () => {
        deleteDebt("fakeId");
      });
      expect(result.current.debtsList).toEqual([]);
    });
  });

  describe("getTotalLoans", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should not return total loans when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalLoans: state.totalLoans,
          }))
        )
      );

      await act(async () => {
        getTotalLoans({});
      });
      expect(result.current.totalLoans).toEqual(0);
    });

    it("should return total loans and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalLoans: state.totalLoans,
          }))
        )
      );

      await act(async () => {
        getTotalLoans({});
      });
      expect(result.current.totalLoans).toEqual(100);
    });

    it("should return total loans in a selected date and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalLoans: state.totalLoans,
          }))
        )
      );

      await act(async () => {
        getTotalLoans({
          timePeriod: timePeriods.day,
          date: "2020/02/02",
        });
      });
      expect(result.current.totalLoans).toEqual(100);
    });

    it("should return total loans in a selected date range and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalLoans: state.totalLoans,
          }))
        )
      );

      await act(async () => {
        getTotalLoans({
          timePeriod: timePeriods.day,
          startDate: "2020/02/02",
          endDate: "2020/02/20",
        });
      });
      expect(result.current.totalLoans).toEqual(100);
    });
  });

  describe("getTotalDebts", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
    it("should not return total debts when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalDebts: state.totalDebts,
          }))
        )
      );

      await act(async () => {
        getTotalDebts({});
      });
      expect(result.current.totalDebts).toEqual(0);
    });

    it("should return total debts and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalDebts: state.totalDebts,
          }))
        )
      );

      await act(async () => {
        getTotalDebts({});
      });
      expect(result.current.totalDebts).toEqual(100);
    });

    it("should return total debts in a selected date and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalDebts: state.totalDebts,
          }))
        )
      );

      await act(async () => {
        getTotalDebts({
          timePeriod: timePeriods.day,
          date: "2020/02/02",
        });
      });
      expect(result.current.totalDebts).toEqual(100);
    });

    it("should return total debts in a selected date range and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() =>
        useDebts(
          useShallow((state) => ({
            totalDebts: state.totalDebts,
          }))
        )
      );

      await act(async () => {
        getTotalDebts({
          timePeriod: timePeriods.day,
          startDate: "2020/02/02",
          endDate: "2020/02/20",
        });
      });
      expect(result.current.totalDebts).toEqual(100);
    });
  });
});
