import fs, { statSync } from "fs";
import path, { join } from "path";

// Custom plugin to clean and copy files
export default function cleanCopy(relativePath: string) {
  // Directory to be cleaned and copied to
  const targetDir = path.resolve(__dirname, relativePath);
  return {
    name: "clean-and-copy-plugin",
    writeBundle() {
      // Clean the target directory
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`Emptied ${targetDir}`);

      // Ensure the target directory exists
      fs.mkdirSync(targetDir, { recursive: true });

      // Copy files
      const srcDir = path.resolve(__dirname, "./dist/client");
      const fileList = getFilePathsRecursive(srcDir);

      fileList.forEach((file) => {
        const destFile = file.replace(srcDir, targetDir);
        const destDir = path.dirname(destFile);

        // Ensure the destination directory exists
        fs.mkdirSync(destDir, { recursive: true });

        fs.copyFileSync(file, destFile);
        console.log(`Copied ${file} to ${destFile}`);
      });
    },
  };
}

function getFilePathsRecursive(inputDir: string): string[] {
  return fs.readdirSync(inputDir).flatMap((file) => {
    const filePath = join(inputDir, file);
    if (statSync(filePath).isDirectory()) {
      return getFilePathsRecursive(filePath);
    } else {
      return filePath;
    }
  });
}
