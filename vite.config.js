import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "src/index.html",
        background: "src/background.js",
        content: "src/content.js",
        // entry points
      },
      output: {
        dir: "dist",
        format: "es",
        sourcemap: true,
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  plugins: [preact()],
});
