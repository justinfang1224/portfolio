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

const colorThemes = (color) => {
  if (color?.semantic && typeof color.semantic.light === "object") {
    return { light: color.semantic.light, dark: color.semantic.dark ?? null };
  }
  if (color && typeof color.light === "object" && typeof color.dark === "object") {
    return color;
  }
  return { light: color, dark: null };
};

const resolveColorValue = (value, primitives) => {
  if (typeof value !== "string" || value.startsWith("#")) return value;
  const [family, step] = value.split("-");
  const hex = primitives?.[family]?.[step];
  if (!hex) {
    throw new Error(`Unknown color primitive "${value}"`);
  }
  return hex;
};

const colorCssValue = (value) => (value.startsWith("#") ? value : `var(--${value})`);

const hexToRgbChannels = (hex) => {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `${red}, ${green}, ${blue}`;
};

const colorDeclarations = (colorNode, primitives) => {
  const entries = walkColor(colorNode);
  const lines = entries.map(
    (entry) => `--color-${entry.name}: ${colorCssValue(entry.value)};`
  );
  const primary = entries.find((entry) => entry.name === "content-primary");

  if (primary) {
    lines.push(
      `--color-content-primary-rgb: ${hexToRgbChannels(resolveColorValue(primary.value, primitives))};`
    );
  }

  return lines;
};

const buildPrimitiveColorCssVars = (primitives) =>
  Object.entries(primitives ?? {}).flatMap(([family, steps]) =>
    Object.entries(steps).map(([step, hex]) => `  --${family}-${step}: ${hex};`)
  );

const buildRadiusCssVars = (tokens) =>
  Object.entries(tokens.radius ?? {}).map(
    ([name, value]) => `  --radius-${toKebab(name)}: ${value}px;`
  );

const buildMotionCssVars = (tokens) => {
  const lines = [];
  for (const [name, value] of Object.entries(tokens.motion?.ease ?? {})) {
    lines.push(`  --ease-${toKebab(name)}: ${value};`);
  }
  for (const [name, value] of Object.entries(tokens.motion?.duration ?? {})) {
    lines.push(`  --duration-${toKebab(name)}: ${value}ms;`);
  }
  for (const [name, spec] of Object.entries(tokens.motion?.semantic ?? {})) {
    lines.push(`  --motion-${toKebab(name)}-duration: var(--duration-${spec.duration});`);
    lines.push(`  --motion-${toKebab(name)}-ease: var(--ease-${spec.ease});`);
  }
  return lines;
};

const cssBlock = (selector, declarations, indentLevel = 0) => {
  const pad = "  ".repeat(indentLevel);
  return [
    `${pad}${selector} {`,
    ...declarations.map((declaration) => `${pad}  ${declaration}`),
    `${pad}}`
  ];
};

const buildSpacingCssVars = (tokens) =>
  Object.entries(tokens.spacing ?? {}).map(
    ([name, value]) => `  --space-${toKebab(name)}: ${value}px;`
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

const buildColorTsObject = (name, colorNode, primitives) => {
  const lines = [`export const ${name} = {`];
  for (const entry of walkColor(colorNode)) {
    lines.push(`  "${entry.name}": "${resolveColorValue(entry.value, primitives)}",`);
  }
  lines.push("} as const;");
  return lines.join("\n");
};

const buildFlatTsObject = (name, entries) => {
  const lines = [`export const ${name} = {`];
  for (const [key, value] of entries) {
    const rendered = typeof value === "number" ? value : JSON.stringify(value);
    lines.push(`  "${key}": ${rendered},`);
  }
  lines.push("} as const;");
  return lines.join("\n");
};

const primitiveColorEntries = (primitives) =>
  Object.entries(primitives ?? {}).flatMap(([family, steps]) =>
    Object.entries(steps).map(([step, hex]) => [`${family}-${step}`, hex])
  );

const motionEntries = (motion) => {
  const entries = [];
  for (const [name, value] of Object.entries(motion?.ease ?? {})) {
    entries.push([`ease-${name}`, value]);
  }
  for (const [name, value] of Object.entries(motion?.duration ?? {})) {
    entries.push([`duration-${name}`, value]);
  }
  return entries;
};

const buildTs = (tokens) => {
  const themes = colorThemes(tokens.color);
  const primitives = tokens.color?.primitive;
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
  lines.push(buildFlatTsObject("radius", Object.entries(tokens.radius ?? {})));
  lines.push("");
  lines.push(buildFlatTsObject("motion", motionEntries(tokens.motion)));
  lines.push("");
  if (primitives) {
    lines.push(buildFlatTsObject("colorPrimitive", primitiveColorEntries(primitives)));
    lines.push("");
  }
  lines.push(buildColorTsObject("color", themes.light, primitives));
  lines.push("");
  if (themes.dark) {
    lines.push(buildColorTsObject("colorDark", themes.dark, primitives));
    lines.push("");
  }
  lines.push("export type TypographyTokenName = keyof typeof typography;");
  lines.push("export type SpacingTokenName = keyof typeof spacing;");
  lines.push("export type RadiusTokenName = keyof typeof radius;");
  lines.push("export type MotionTokenName = keyof typeof motion;");
  if (primitives) {
    lines.push("export type ColorPrimitiveName = keyof typeof colorPrimitive;");
  }
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
  const themes = colorThemes(tokens.color);
  const primitives = tokens.color?.primitive;
  const lightDeclarations = [
    "color-scheme: light;",
    `--font-family-base: ${tokens.meta.fontFamily};`,
    ...buildTypographyCssVars(tokens).map((line) => line.trim()),
    ...buildSpacingCssVars(tokens).map((line) => line.trim()),
    ...buildRadiusCssVars(tokens).map((line) => line.trim()),
    ...buildMotionCssVars(tokens).map((line) => line.trim()),
    ...buildPrimitiveColorCssVars(primitives).map((line) => line.trim()),
    ...colorDeclarations(themes.light, primitives)
  ];
  const lines = [banner, "", ...cssBlock(":root", lightDeclarations)];

  if (themes.dark) {
    const darkDeclarations = ["color-scheme: dark;", ...colorDeclarations(themes.dark, primitives)];
    lines.push("");
    lines.push(...cssBlock('[data-theme="dark"]', darkDeclarations));
    lines.push("");
    lines.push("@media (prefers-color-scheme: dark) {");
    lines.push(...cssBlock(':root:not([data-theme="light"])', darkDeclarations, 1));
    lines.push("}");
  }

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
    ".text-subtitle-2 { font-family: var(--font-family-base); font-size: var(--typography-subtitle-2-font-size); font-weight: var(--typography-subtitle-2-font-weight); line-height: var(--typography-subtitle-2-line-height); }"
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
