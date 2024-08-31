import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { defineConfig } from "vite";
import iifeBundle from "./iife-custom-plugin";

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

// Find all Svelte components in the src directory
const srcDir = resolve(__dirname, "src");
const componentFiles = getAllSvelteComponents(srcDir);

const input = componentFiles.reduce((acc, file) => {
  const name = file.replace(srcDir, "").replace(".svelte", "").replace("/", "");
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
