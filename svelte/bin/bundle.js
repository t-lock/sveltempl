import path from "path";
import { fileURLToPath } from "url";
import { build, defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildIndividually([name, relativePath]) {
  const config = defineConfig({
    build: {
      ssr: true,
      rollupOptions: {
        input: path.resolve(__dirname, relativePath),
        output: {
          dir: "dist-ssr-go",
          format: "iife",
          name,
        },
      },
    },
  });

  build(config);
}

Object.entries({
  BoxOne: "../dist-ssr/BoxOne.js",
  BoxTwo: "../dist-ssr/BoxTwo.js",
  BoxThree: "../dist-ssr/BoxThree.js",
}).forEach((entry) => buildIndividually(entry));
