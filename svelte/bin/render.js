import path from "path";
import { fileURLToPath } from "url";

// Access command-line arguments
const args = process.argv.slice(2);

// Check if the argument is provided
if (args.length === 0) {
  process.stderr.write(
    "Please provide the component name in the format: 'ComponentName'.\n"
  );
  process.exit(1);
}

// Get the first argument (assuming only one argument is passed)
const componentPath = `../dist-ssr/${args[0]}.js`;

// Convert __filename and __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function renderComponent() {
  try {
    // Dynamically import the SSR component
    const { default: Component } = await import(
      path.resolve(__dirname, componentPath)
    );

    // Render the component and output the HTML
    process.stdout.write(Component.render({ server: true }).html);
  } catch (error) {
    process.stderr.write(`Error rendering component: ${error.message}\n`);
  }
}

renderComponent().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
});
