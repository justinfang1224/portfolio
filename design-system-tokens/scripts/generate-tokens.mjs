import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "tokens", "source.json");
const outDir = path.join(rootDir, "src");
const cssOutPath = path.join(outDir, "tokens.css");
const tsOutPath = path.join(outDir, "tokens.ts");

const toKebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

const banner = `/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
 * Source: tokens/source.json
 * Run: npm run tokens:build
 */`;

const buildTypographyCssVars = (tokens) => {
  const lines = [];
  for (const [name, spec] of Object.entries(tokens.typography)) {
    const key = toKebab(name);
    lines.push(`  --typography-${key}-font-size: ${spec.size}px;`);
    lines.push(`  --typography-${key}-font-weight: ${spec.weight};`);
    lines.push(`  --typography-${key}-line-height: ${spec.lineHeight}px;`);
  }
  return lines;
};

const walkColor = (node, pathParts = []) => {
  if (typeof node === "string") {
    return [{ name: pathParts.join("-"), value: node }];
  }
  return Object.entries(node).flatMap(([key, value]) =>
    walkColor(value, [...pathParts, toKebab(key)])
  );
};

const buildColorCssVars = (tokens) =>
  walkColor(tokens.color).map(
    (entry) => `  --color-${entry.name}: ${entry.value};`
  );

const buildSpacingCssVars = (tokens) =>
  Object.entries(tokens.spacing ?? {}).map(
    ([name, value]) => `  --spacing-${toKebab(name)}: ${value}px;`
  );

const buildTypographyTsObject = (tokens) => {
  const lines = ["export const typography = {"];
  for (const [name, spec] of Object.entries(tokens.typography)) {
    lines.push(`  "${name}": {`);
    lines.push(`    size: ${spec.size},`);
    lines.push(`    weight: ${spec.weight},`);
    lines.push(`    lineHeight: ${spec.lineHeight}`);
    lines.push("  },");
  }
  lines.push("} as const;");
  return lines.join("\n");
};

const buildSpacingTsObject = (tokens) => {
  const lines = ["export const spacing = {"];
  for (const [name, value] of Object.entries(tokens.spacing ?? {})) {
    lines.push(`  "${name}": ${value},`);
  }
  lines.push("} as const;");
  return lines.join("\n");
};

const buildTs = (tokens) => {
  const colorEntries = walkColor(tokens.color);
  const lines = [banner, "", "export const meta = {"];
  lines.push(`  name: "${tokens.meta.name}",`);
  lines.push(`  version: "${tokens.meta.version}",`);
  lines.push(`  fontFamily: ${JSON.stringify(tokens.meta.fontFamily)}`);
  lines.push("} as const;");
  lines.push("");
  lines.push(buildTypographyTsObject(tokens));
  lines.push("");
  lines.push(buildSpacingTsObject(tokens));
  lines.push("");
  lines.push("export const color = {");
  for (const entry of colorEntries) {
    lines.push(`  "${entry.name}": "${entry.value}",`);
  }
  lines.push("} as const;");
  lines.push("");
  lines.push("export type TypographyTokenName = keyof typeof typography;");
  lines.push("export type SpacingTokenName = keyof typeof spacing;");
  lines.push("export type ColorTokenName = keyof typeof color;");
  lines.push("");
  lines.push(
    "export const buttonSecondaryState = { default: color[\"button-secondary-default\"], hover: color[\"button-secondary-hover\"], pressed: color[\"button-secondary-pressed\"] } as const;"
  );
  lines.push(
    "export const cardBackground = { primary: color[\"surface-card-primary\"], secondary: color[\"surface-card-secondary\"] } as const;"
  );
  lines.push("");
  return `${lines.join("\n")}\n`;
};

const buildCss = (tokens) => {
  const lines = [banner, "", ":root {"];
  lines.push(`  --font-family-base: ${tokens.meta.fontFamily};`);
  lines.push(...buildTypographyCssVars(tokens));
  lines.push(...buildSpacingCssVars(tokens));
  lines.push(...buildColorCssVars(tokens));
  lines.push("}");
  lines.push("");
  lines.push(
    ".text-heading-1 { font-family: var(--font-family-base); font-size: var(--typography-heading-1-font-size); font-weight: var(--typography-heading-1-font-weight); line-height: var(--typography-heading-1-line-height); }"
  );
  lines.push(
    ".text-heading-2 { font-family: var(--font-family-base); font-size: var(--typography-heading-2-font-size); font-weight: var(--typography-heading-2-font-weight); line-height: var(--typography-heading-2-line-height); }"
  );
  lines.push(
    ".text-heading-3 { font-family: var(--font-family-base); font-size: var(--typography-heading-3-font-size); font-weight: var(--typography-heading-3-font-weight); line-height: var(--typography-heading-3-line-height); }"
  );
  lines.push(
    ".text-subtitle { font-family: var(--font-family-base); font-size: var(--typography-subtitle-font-size); font-weight: var(--typography-subtitle-font-weight); line-height: var(--typography-subtitle-line-height); }"
  );
  lines.push(
    ".text-button { font-family: var(--font-family-base); font-size: var(--typography-button-font-size); font-weight: var(--typography-button-font-weight); line-height: var(--typography-button-line-height); }"
  );
  lines.push(
    ".text-body-large { font-family: var(--font-family-base); font-size: var(--typography-body-large-font-size); font-weight: var(--typography-body-large-font-weight); line-height: var(--typography-body-large-line-height); }"
  );
  lines.push(
    ".text-body-medium { font-family: var(--font-family-base); font-size: var(--typography-body-medium-font-size); font-weight: var(--typography-body-medium-font-weight); line-height: var(--typography-body-medium-line-height); }"
  );
  lines.push(
    ".text-body-small { font-family: var(--font-family-base); font-size: var(--typography-body-small-font-size); font-weight: var(--typography-body-small-font-weight); line-height: var(--typography-body-small-line-height); }"
  );
  lines.push(
    ".text-caption { font-family: var(--font-family-base); font-size: var(--typography-caption-font-size); font-weight: var(--typography-caption-font-weight); line-height: var(--typography-caption-line-height); }"
  );
  lines.push("");
  lines.push(
    ".btn-secondary { background-color: var(--color-button-secondary-default); }"
  );
  lines.push(
    ".btn-secondary:hover { background-color: var(--color-button-secondary-hover); }"
  );
  lines.push(
    ".btn-secondary:active { background-color: var(--color-button-secondary-pressed); }"
  );
  lines.push("");
  lines.push(
    ".card-surface-primary { background-color: var(--color-surface-card-primary); }"
  );
  lines.push(
    ".card-surface-secondary { background-color: var(--color-surface-card-secondary); }"
  );
  lines.push("");
  return `${lines.join("\n")}\n`;
};

const main = async () => {
  const raw = await readFile(sourcePath, "utf8");
  const tokens = JSON.parse(raw);

  await mkdir(outDir, { recursive: true });
  await writeFile(cssOutPath, buildCss(tokens), "utf8");
  await writeFile(tsOutPath, buildTs(tokens), "utf8");
};

await main();
