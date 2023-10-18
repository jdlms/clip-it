import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        background: "src/background.js",
        content: "src/content.js",
        // entry points
      },
      output: {
        dir: "dist",
        format: "es",
        sourcemap: true,
      },
    },
  },
  plugins: [preact()],
});
