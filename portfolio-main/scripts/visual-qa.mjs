import { execSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const scanRoots = [
  path.join(rootDir, "app"),
  path.join(rootDir, "components")
];

const errors = [];
const warnings = [];

async function collectCssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        continue;
      }

      files.push(...(await collectCssFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".css") || entry.name.endsWith(".module.css"))) {
      files.push(fullPath);
    }
  }

  return files;
}

function relativeFromRoot(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

function checkAnimatedBlurNeedsTouchFallback(content, filePath) {
  const hasBlurAnimation =
    /@keyframes[\s\S]*?filter:\s*blur|animation:\s*[^;]*blur|home-appear-blur/.test(content);

  if (!hasBlurAnimation) {
    return;
  }

  const hasTouchFallback =
    /\(hover:\s*none\)/.test(content) ||
    /pointer:\s*coarse/.test(content) ||
    /max-width:\s*767px/.test(content) ||
    /appearFade|appear-fade/.test(content);

  if (!hasTouchFallback) {
    errors.push(
      `${relativeFromRoot(filePath)}: blur-based reveal animation without a touch/mobile fallback (add fade path or coarse-pointer media query).`
    );
  }
}

function checkPageGutterViolations(content, filePath) {
  const relative = relativeFromRoot(filePath);

  if (relative !== "app/globals.css" && /100vw/.test(content)) {
    warnings.push(
      `${relative}: uses \`100vw\` — confirm no mobile horizontal overflow; prefer shell/gutter tokens.`
    );
  }

  if (/padding-inline:\s*\d+px/.test(content) && !content.includes("--portfolio-page-gutter")) {
    warnings.push(
      `${relative}: hard-coded horizontal padding — prefer \`var(--portfolio-page-gutter)\`.`
    );
  }
}

async function runStaticScan() {
  const cssFiles = [];

  for (const scanRoot of scanRoots) {
    cssFiles.push(...(await collectCssFiles(scanRoot)));
  }

  for (const filePath of cssFiles) {
    const content = await readFile(filePath, "utf8");
    checkAnimatedBlurNeedsTouchFallback(content, filePath);
    checkPageGutterViolations(content, filePath);
  }
}

function runLint() {
  try {
    execSync("npm run lint", { cwd: rootDir, stdio: "inherit" });
  } catch {
    errors.push("next lint failed.");
  }
}

function runTypecheck() {
  try {
    execSync("npx tsc --noEmit", { cwd: rootDir, stdio: "pipe" });
  } catch {
    errors.push("TypeScript check (tsc --noEmit) failed.");
  }
}

function printSummary() {
  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }

  if (errors.length > 0) {
    console.error("\nVisual QA failed:\n");
    for (const error of errors) {
      console.error(`  • ${error}`);
    }
    console.error("\nRun the browser pass in .cursor/rules/visual-qa-specialist.mdc after fixing.\n");
    process.exitCode = 1;
    return;
  }

  console.log("Visual QA static checks passed.");
  if (warnings.length > 0) {
    console.log(`${warnings.length} warning(s) — review before release.`);
  }
}

async function main() {
  const mode = process.argv[2] ?? "full";

  await runStaticScan();

  if (mode === "static") {
    printSummary();
    return;
  }

  if (errors.length > 0) {
    printSummary();
    return;
  }

  runLint();

  if (mode === "full") {
    runTypecheck();
  }

  printSummary();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
