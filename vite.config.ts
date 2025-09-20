import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
/// <reference types="vitest" />

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
