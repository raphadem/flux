// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@graphics": path.resolve(__dirname, "src/graphics"),
      "@physics": path.resolve(__dirname, "src/physics"),
      "@entities": path.resolve(__dirname, "src/entities"),
      "@bindings": path.resolve(__dirname, "src/bindings"),
    },
  },
});
