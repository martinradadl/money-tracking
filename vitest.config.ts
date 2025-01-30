import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      root: "./src/tests",
      setupFiles: ["./setup-vitest.ts"],
    },
  })
);
