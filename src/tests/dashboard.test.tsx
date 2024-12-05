import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { createWrapper } from "./utils.js";
import { useDashboard } from "../data/dashboard.js";

vi.mock("axios");

const wrapper = createWrapper(true);

describe("useTransactions", () => {
  describe("getTotalBalance", () => {
    it("should not return balance when status is not 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        status: 500,
      });

      const { result } = renderHook(() => useDashboard(), { wrapper });

      await act(async () => {
        result.current.getTotalBalance();
      });
      expect(result.current.totalBalance).toEqual(0);
    });

    it("should return balance and statusCode 200", async () => {
      vi.mocked(axios, true).get.mockResolvedValueOnce({
        data: 100,
        status: 200,
      });

      const { result } = renderHook(() => useDashboard(), { wrapper });

      await act(async () => {
        result.current.getTotalBalance();
      });
      expect(result.current.totalBalance).toEqual(100);
    });
  });
});
