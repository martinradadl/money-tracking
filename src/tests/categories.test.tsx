import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { categories, createWrapper } from "./utils.js";
import { useCategories } from "../data/categories.js";

vi.mock("axios");

const wrapper = createWrapper(true);

describe("getCategories", () => {
  it("should return empty categories list when status is not 200", async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      status: 500,
    });

    const { result } = renderHook(() => useCategories(), { wrapper });

    await act(async () => {
      result.current.getCategories();
    });
    expect(result.current.categories).toEqual([]);
  });

  it("should return categories list and statusCode 200", async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: categories,
      status: 200,
    });

    const { result } = renderHook(() => useCategories(), { wrapper });

    await act(async () => {
      result.current.getCategories();
    });
    expect(result.current.categories).toEqual(categories);
  });
});
