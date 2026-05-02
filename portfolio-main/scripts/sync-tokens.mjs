import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const source = path.resolve(rootDir, "..", "design-system-tokens", "src", "tokens.css");
const destinationDir = path.join(rootDir, "app", "styles", "generated");
const destination = path.join(destinationDir, "tokens.css");

try {
  await access(source);
  await mkdir(destinationDir, { recursive: true });
  await copyFile(source, destination);
} catch (error) {
  // Vercel deployments may only include `portfolio-main/` (without the sibling
  // `design-system-tokens/` folder). Since `app/styles/generated/tokens.css` is
  // committed, we can safely continue if the destination already exists.
  try {
    await access(destination);
    console.warn("Design token source not found; using committed generated tokens.");
    console.warn(`Missing source: ${source}`);
    console.warn(`Using destination: ${destination}`);
    process.exit(0);
  } catch {
    // fall through to hard error below
  }

  console.error("Unable to sync design tokens into the portfolio app.");
  console.error(`Expected token source: ${source}`);
  console.error(`Destination: ${destination}`);
  console.error("Make sure the sibling design-system-tokens folder exists, then restart the preview.");

  if (error instanceof Error) {
    console.error(`Original error: ${error.message}`);
  }

  process.exit(1);
}

console.log("Synced design-system-tokens/src/tokens.css into portfolio landing app.");
