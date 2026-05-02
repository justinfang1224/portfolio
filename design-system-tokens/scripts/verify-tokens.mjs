import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

const runGenerate = () =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/generate-tokens.mjs"], {
      cwd: rootDir,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`generate-tokens exited with code ${code}`));
    });
  });

const main = async () => {
  const beforeCss = await readFile(path.join(srcDir, "tokens.css"), "utf8").catch(() => "");
  const beforeTs = await readFile(path.join(srcDir, "tokens.ts"), "utf8").catch(() => "");

  await runGenerate();

  const afterCss = await readFile(path.join(srcDir, "tokens.css"), "utf8");
  const afterTs = await readFile(path.join(srcDir, "tokens.ts"), "utf8");

  if (beforeCss !== afterCss || beforeTs !== afterTs) {
    console.error(
      "Token outputs were out of sync. Run `npm run tokens:build` and commit updated files."
    );
    process.exit(1);
  }

  console.log("Tokens are up-to-date with tokens/source.json.");
};

await main();
