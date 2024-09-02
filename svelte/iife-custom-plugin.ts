import { readdirSync, statSync } from "fs";
import fs from "fs/promises";
import path, { join } from "path";
import { rollup } from "rollup";
import { Plugin } from "vite";

type Options = {
  outputDir?: string;
  inputDir?: string;
};

export default function iifeBundle(options: Options = {}): Plugin {
  const { outputDir = "dist/ssr-go", inputDir = "dist/ssr" } = options;

  return {
    name: "sveltempl-iife-bundle",
    apply: "build",
    async writeBundle() {
      // Clear the output directory
      await fs.rm(outputDir, { recursive: true, force: true });
      await fs.mkdir(outputDir, { recursive: true });

      const fileList = getFilePathsRecursive(inputDir).filter((file) =>
        file.endsWith(".js")
      );

      for (const file of fileList) {
        if (file.includes("/assets/")) continue;

        const name = path.basename(file, ".js");

        const bundle = await rollup({
          input: file,
          onwarn: (warning, warn) => {
            if (warning.code === "CIRCULAR_DEPENDENCY") return;
            warn(warning);
          },
        });

        await bundle.write({
          file: file.replace(inputDir, outputDir),
          format: "iife",
          name,
          sourcemap: false,
        });

        await bundle.close();
      }

      console.log(`IIFE bundles generated in ${outputDir}`);
    },
  };
}

function getFilePathsRecursive(inputDir: string): string[] {
  return readdirSync(inputDir).flatMap((file) => {
    const filePath = join(inputDir, file);
    if (statSync(filePath).isDirectory()) {
      return getFilePathsRecursive(filePath);
    } else {
      return filePath;
    }
  });
}
