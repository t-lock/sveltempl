import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";
import cleanCopy from "./clean-copy-custom-plugin";

export default defineConfig({
  plugins: [
    svelte({
      emitCss: false,
    }),
    cleanCopy("../cmd/web/assets/js/client"),
  ],
  build: {
    rollupOptions: {
      input: "./src/main.ts",
      output: {
        dir: "dist/client",
        format: "es",
        chunkFileNames: ({ facadeModuleId }) => {
          if (facadeModuleId) {
            const name = facadeModuleId
              .replace(resolve(__dirname, "src") + "/", "")
              .replace(".svelte", "");
            return `${name}-[hash].js`;
          } else {
            return `[name]-[hash].js`;
          }
        },
      },
    },
  },
});
