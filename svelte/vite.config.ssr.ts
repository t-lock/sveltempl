import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readdirSync, statSync } from "fs";
import { basename, join, resolve } from "path";
import { defineConfig } from "vite";
import iifeBundle from "./plugin";

function getAllSvelteComponents(dir: string, fileList: string[] = []) {
  const files = readdirSync(dir);
  files.forEach((file) => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getAllSvelteComponents(filePath, fileList);
    } else if (filePath.endsWith(".svelte")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Find all Svelte components in the src/lib directory
const componentFiles = getAllSvelteComponents(resolve(__dirname, "src/lib"));

const input = componentFiles.reduce((acc, file) => {
  const name = basename(file, ".svelte"); // Use the base name without the directory
  acc[name] = resolve(__dirname, file);
  return acc;
}, {} as Record<string, string>);

export default defineConfig({
  plugins: [
    svelte(),
    iifeBundle({
      outputDir: "dist-ssr-go",
      inputDir: "dist-ssr",
    }),
  ],
  build: {
    ssr: true,
    rollupOptions: {
      input,
      output: {
        dir: "dist-ssr",
      },
    },
  },
});
