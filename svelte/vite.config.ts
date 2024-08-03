import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import cleanCopy from "./clean-copy-custom-plugin";

export default defineConfig({
  plugins: [
    svelte({
      emitCss: false,
    }),
    cleanCopy("../cmd/web/assets/svelte"),
  ],
  build: {
    rollupOptions: {
      input: "./src/main.ts",
    },
  },
});
