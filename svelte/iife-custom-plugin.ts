import fs from "fs/promises";
import path from "path";
import { rollup } from "rollup";
import { Plugin } from "vite";

type Options = {
  outputDir?: string;
  inputDir?: string;
};
export default function iifeBundle(options: Options = {}): Plugin {
  const { outputDir = "dist-ssr-go", inputDir = "dist-ssr" } = options;

  return {
    name: "sveltempl-iife-bundle",
    apply: "build",
    async writeBundle() {
      // Clear the output directory
      await fs.rm(outputDir, { recursive: true, force: true });
      await fs.mkdir(outputDir, { recursive: true });

      const inputFiles = await fs.readdir(inputDir);
      const jsFiles = inputFiles.filter((file) => file.endsWith(".js"));

      for (const file of jsFiles) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        const name = path.basename(file, ".js");

        const bundle = await rollup({
          input: inputPath,
          onwarn: (warning, warn) => {
            if (warning.code === "CIRCULAR_DEPENDENCY") return;
            warn(warning);
          },
        });

        await bundle.write({
          file: outputPath,
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
