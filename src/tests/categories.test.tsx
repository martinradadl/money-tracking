import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { categories } from "./utils.js";
import { getCategories, useCategories } from "../data/categories.js";
import { useShallow } from "zustand/shallow";

vi.mock("axios");

describe("getCategories", () => {
  it("should return empty categories list when status is not 200", async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      status: 500,
    });

    const { result } = renderHook(() =>
      useCategories(
        useShallow((state) => ({
          categories: state.categories,
        }))
      )
    );

    await act(async () => {
      getCategories();
    });
    expect(result.current.categories).toEqual([]);
  });

  it("should return categories list and statusCode 200", async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: categories,
      status: 200,
    });

    const { result } = renderHook(() =>
      useCategories(
        useShallow((state) => ({
          categories: state.categories,
        }))
      )
    );

    await act(async () => {
      getCategories();
    });
    expect(result.current.categories).toEqual(categories);
  });
});
