import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    copy({
      targets: [
        {
          src: "./dist/assets/*",
          dest: "../cmd/web/assets",
        },
      ],
      hook: "writeBundle",
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        page: resolve(__dirname, "page.html"),
      },
    },
  },
});
