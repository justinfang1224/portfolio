type Spec = [number, number, number];
type Pseudo = "::before" | "::after" | null;

type IndexedRule = {
  media: string | null;
  order: number;
  selector: string;
  spec: Spec;
  style: CSSStyleDeclaration;
};

type Decl = {
  important: boolean;
  inline: boolean;
  order: number;
  spec: Spec;
  value: string;
};

export type ColorTokenRow = {
  chain: string;
  detail: string;
  inherited: boolean;
  label: string;
  swatch: string;
};

const INHERITED = new Set(["color", "fill", "stroke", "text-decoration-color"]);

const SHORTHANDS: Record<string, string[]> = {
  "background-color": ["background"],
  "border-top-color": ["border-color", "border-top", "border"],
  "border-right-color": ["border-color", "border-right", "border"],
  "border-bottom-color": ["border-color", "border-bottom", "border"],
  "border-left-color": ["border-color", "border-left", "border"],
  "outline-color": ["outline"],
  "text-decoration-color": ["text-decoration"]
};

let cachedSignature = "";
let cachedRules: IndexedRule[] = [];

function specificity(selector: string): Spec {
  let index = 0;
  let ids = 0;
  let classes = 0;
  let types = 0;
  const length = selector.length;

  const scoreArguments = (): Spec => {
    const pieces: string[] = [];
    let start = index;
    let depth = 0;

    while (index < length) {
      const character = selector[index];
      if (character === "(") {
        depth += 1;
      } else if (character === ")") {
        if (depth === 0) {
          break;
        }
        depth -= 1;
      } else if (character === "," && depth === 0) {
        pieces.push(selector.slice(start, index));
        index += 1;
        start = index;
        continue;
      }
      index += 1;
    }

    pieces.push(selector.slice(start, index));
    let best: Spec = [0, 0, 0];
    for (const piece of pieces) {
      const score = specificity(piece.trim());
      if (compareSpec(score, best) > 0) {
        best = score;
      }
    }
    return best;
  };

  while (index < length) {
    const character = selector[index];

    if (character === " " || character === ">" || character === "+" || character === "~" || character === "|") {
      index += 1;
      continue;
    }

    if (character === "*") {
      index += 1;
      continue;
    }

    if (character === "#") {
      ids += 1;
      index += 1;
      while (index < length && /[\w-]/.test(selector[index])) {
        index += 1;
      }
      continue;
    }

    if (character === ".") {
      classes += 1;
      index += 1;
      while (index < length && /[\w-]/.test(selector[index])) {
        index += 1;
      }
      continue;
    }

    if (character === "[") {
      classes += 1;
      while (index < length && selector[index] !== "]") {
        index += 1;
      }
      index += 1;
      continue;
    }

    if (character === ":") {
      const pseudoElement = selector[index + 1] === ":";
      index += pseudoElement ? 2 : 1;
      let name = "";
      while (index < length && /[\w-]/.test(selector[index])) {
        name += selector[index];
        index += 1;
      }

      if (selector[index] === "(") {
        index += 1;
        const argumentScore = scoreArguments();
        if (selector[index] === ")") {
          index += 1;
        }
        if (name === "is" || name === "not" || name === "has" || name === "matches") {
          ids += argumentScore[0];
          classes += argumentScore[1];
          types += argumentScore[2];
        } else if (name !== "where") {
          classes += 1;
        }
      } else if (pseudoElement) {
        types += 1;
      } else {
        classes += 1;
      }
      continue;
    }

    if (/[a-zA-Z_]/.test(character)) {
      types += 1;
      while (index < length && /[\w-]/.test(selector[index])) {
        index += 1;
      }
      continue;
    }

    index += 1;
  }

  return [ids, classes, types];
}

function compareSpec(left: Spec, right: Spec) {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2];
}

function splitSelectors(selector: string) {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | null = null;

  for (let index = 0; index < selector.length; index += 1) {
    const character = selector[index];
    if (quote) {
      current += character;
      if (character === quote && selector[index - 1] !== "\\") {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      current += character;
      continue;
    }

    if (character === "(" || character === "[") {
      depth += 1;
    } else if (character === ")" || character === "]") {
      depth = Math.max(0, depth - 1);
    } else if (character === "," && depth === 0) {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function childRules(rule: CSSRule): CSSRuleList | null {
  if (
    rule instanceof CSSMediaRule ||
    rule instanceof CSSSupportsRule ||
    rule instanceof CSSLayerBlockRule ||
    (typeof CSSContainerRule !== "undefined" && rule instanceof CSSContainerRule)
  ) {
    return rule.cssRules;
  }

  if (rule instanceof CSSImportRule && rule.styleSheet) {
    try {
      return rule.styleSheet.cssRules;
    } catch {
      return null;
    }
  }

  return null;
}

function walkRules(rules: CSSRuleList, media: string | null, order: { n: number }, out: IndexedRule[]) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      for (const selector of splitSelectors(rule.selectorText)) {
        out.push({
          media,
          order: order.n,
          selector,
          spec: specificity(selector),
          style: rule.style
        });
        order.n += 1;
      }
      continue;
    }

    if (rule instanceof CSSSupportsRule && !CSS.supports(rule.conditionText)) {
      continue;
    }

    const nested = childRules(rule);
    if (!nested) {
      continue;
    }

    const nextMedia =
      rule instanceof CSSMediaRule ? (media ? `${media} and (${rule.conditionText})` : rule.conditionText) : media;
    walkRules(nested, nextMedia, order, out);
  }
}

function stylesheetSignature() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return String(sheet.cssRules.length);
      } catch {
        return sheet.href ?? "x";
      }
    })
    .join(",");
}

function getRules() {
  const signature = stylesheetSignature();
  if (signature === cachedSignature) {
    return cachedRules;
  }

  const rules: IndexedRule[] = [];
  const order = { n: 0 };
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walkRules(sheet.cssRules, null, order, rules);
    } catch {
      // Cross-origin sheets are not readable.
    }
  }

  cachedRules = rules;
  cachedSignature = signature;
  return rules;
}

function mediaMatches(media: string | null) {
  if (!media) {
    return true;
  }

  try {
    return window.matchMedia(media).matches;
  } catch {
    return false;
  }
}

function selectorApplies(selector: string, element: Element, pseudo: Pseudo) {
  const hasBefore = selector.includes("::before");
  const hasAfter = selector.includes("::after");
  if (pseudo === "::before" && !hasBefore) {
    return false;
  }
  if (pseudo === "::after" && !hasAfter) {
    return false;
  }
  if (pseudo === null && (hasBefore || hasAfter)) {
    return false;
  }

  const base = selector.replace(/::before|::after/g, "").trim();
  if (!base) {
    return false;
  }

  try {
    return element.matches(base);
  } catch {
    return false;
  }
}

function colorFromShorthand(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "none" || trimmed === "0" || trimmed === "initial") {
    return null;
  }

  if (/^(var\(|color-mix\(|rgba?\(|hsla?\(|hwb\(|#|currentcolor|transparent)/i.test(trimmed)) {
    return trimmed;
  }

  return (
    trimmed.match(/var\([^)]+\)/)?.[0] ??
    trimmed.match(/#[0-9a-fA-F]{3,8}/)?.[0] ??
    trimmed.match(/(?:rgb|hsl|hwb|color-mix)a?\([^)]*\)/i)?.[0] ??
    null
  );
}

function declared(style: CSSStyleDeclaration, property: string) {
  const direct = style.getPropertyValue(property).trim();
  if (direct) {
    return {
      important: style.getPropertyPriority(property) === "important",
      value: direct
    };
  }

  for (const shorthand of SHORTHANDS[property] ?? []) {
    const value = style.getPropertyValue(shorthand).trim();
    const color = value ? colorFromShorthand(value) : null;
    if (!color) {
      continue;
    }

    return {
      important: style.getPropertyPriority(shorthand) === "important",
      value: color
    };
  }

  return null;
}

function beats(next: Decl, current: Decl) {
  const rank = (decl: Decl) => [
    decl.important ? 1 : 0,
    decl.inline ? 1 : 0,
    decl.spec[0],
    decl.spec[1],
    decl.spec[2],
    decl.order
  ];
  const left = rank(next);
  const right = rank(current);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] > right[index];
    }
  }
  return false;
}

function inlineStyle(element: Element) {
  if (element instanceof HTMLElement || element instanceof SVGElement) {
    return element.style;
  }
  return null;
}

function winningDecl(element: Element, property: string, pseudo: Pseudo) {
  let best: Decl | null = null;
  const inline = pseudo === null ? inlineStyle(element) : null;
  if (inline) {
    const found = declared(inline, property);
    if (found) {
      best = {
        ...found,
        inline: true,
        order: Number.MAX_SAFE_INTEGER,
        spec: [0, 0, 0]
      };
    }
  }

  for (const rule of getRules()) {
    if (!mediaMatches(rule.media)) {
      continue;
    }
    if (!selectorApplies(rule.selector, element, pseudo)) {
      continue;
    }

    const found = declared(rule.style, property);
    if (!found) {
      continue;
    }

    const next: Decl = {
      ...found,
      inline: false,
      order: rule.order,
      spec: rule.spec
    };
    if (!best || beats(next, best)) {
      best = next;
    }
  }

  return best;
}

function resolveProp(element: Element, property: string, inherit: boolean, pseudo: Pseudo = null) {
  let node: Element | null = element;
  let inherited = false;

  while (node) {
    const decl = winningDecl(node, property, pseudo);
    if (decl && decl.value !== "inherit" && decl.value !== "unset") {
      if (decl.value === "initial") {
        return null;
      }
      return { inherited, value: decl.value };
    }

    if (!inherit) {
      return null;
    }

    inherited = true;
    node = node.parentElement;
    pseudo = null;
  }

  return null;
}

function customPropValue(element: Element, name: string) {
  let node: Element | null = element;
  while (node) {
    const decl = winningDecl(node, name, null);
    if (decl && decl.value !== "inherit" && decl.value !== "unset" && decl.value !== "initial") {
      return decl.value;
    }
    node = node.parentElement;
  }
  return null;
}

function fullChain(element: Element, name: string, depth = 0): string[] {
  const label = name.replace(/^--/, "");
  if (depth > 6) {
    return [label];
  }

  const next = customPropValue(element, name);
  if (!next) {
    return [label];
  }

  const names = [...next.matchAll(/var\(\s*(--[A-Za-z0-9-_]+)/g)].map((match) => match[1]);
  if (names.length === 1 && next.trim().startsWith("var(")) {
    return [label, ...fullChain(element, names[0], depth + 1)];
  }

  return [label];
}

function describeValue(element: Element, value: string, depth = 0): { chain: string; detail: string; kind: string } {
  const trimmed = value.trim();
  if (depth > 6) {
    return { chain: "", detail: trimmed, kind: "raw" };
  }

  if (/^currentcolor$/i.test(trimmed)) {
    const parent = element.parentElement;
    const color = parent ? resolveProp(parent, "color", true) : null;
    if (!color) {
      return { chain: "currentColor", detail: "", kind: "current" };
    }
    const inner = describeValue(parent ?? element, color.value, depth + 1);
    return {
      chain: inner.chain ? `currentColor → ${inner.chain}` : "currentColor",
      detail: inner.detail,
      kind: "current"
    };
  }

  const names = [...trimmed.matchAll(/var\(\s*(--[A-Za-z0-9-_]+)/g)].map((match) => match[1]);
  if (names.length === 0) {
    return { chain: "", detail: trimmed, kind: "raw" };
  }

  const chain = names.map((name) => fullChain(element, name).join(" → ")).join(", ");
  const simple = names.length === 1 && trimmed.startsWith("var(");
  return {
    chain,
    detail: simple ? "" : trimmed,
    kind: simple ? "token" : "mix"
  };
}

function parseColor(color: string) {
  if (color === "transparent") {
    return { alpha: 0, hex: "transparent" };
  }

  const match = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)/i);
  if (!match) {
    return null;
  }

  const hex = [match[1], match[2], match[3]]
    .map((channel) => Math.round(Number(channel)).toString(16).padStart(2, "0"))
    .join("");
  let alpha = 1;
  if (match[4]) {
    alpha = match[4].endsWith("%") ? Number(match[4]) / 100 : Number(match[4]);
  }

  return { alpha, hex: `#${hex}` };
}

function hexLabel(color: string) {
  const parsed = parseColor(color);
  if (!parsed) {
    return color;
  }
  if (parsed.alpha <= 0) {
    return "transparent";
  }
  if (parsed.alpha < 1) {
    return `${parsed.hex} / ${Math.round(parsed.alpha * 100)}%`;
  }
  return parsed.hex;
}

function isVisibleColor(color: string) {
  const parsed = parseColor(color);
  if (!parsed) {
    return color !== "transparent" && color !== "rgba(0, 0, 0, 0)";
  }
  return parsed.alpha > 0.01;
}

export function elementLabel(element: Element) {
  const id = element.id ? `#${element.id}` : "";
  const className =
    element instanceof SVGElement ? (element.getAttribute("class") ?? "") : typeof element.className === "string" ? element.className : "";
  const first = className.trim().split(/\s+/).filter(Boolean)[0];
  return `${element.tagName.toLowerCase()}${id}${first ? `.${first}` : ""}`;
}

export function elementStack(element: Element) {
  const stack: Element[] = [];
  let node: Element | null = element;
  while (node && stack.length < 6 && node !== document.body && node !== document.documentElement) {
    stack.push(node);
    node = node.parentElement;
  }
  return stack;
}

function hasDirectText(element: Element) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return true;
  }

  return Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()));
}

function tokenSwatch(element: Element, value: string) {
  const match = value.trim().match(/^var\(\s*(--[A-Za-z0-9-_]+)\s*(?:,[^)]*)?\)$/);
  if (!match) {
    return null;
  }

  let node: Element | null = element;
  while (node) {
    const resolved = getComputedStyle(node).getPropertyValue(match[1]).trim();
    if (resolved) {
      return resolved;
    }
    node = node.parentElement;
  }

  return null;
}

function rowFromValue(label: string, inherited: boolean, value: string, element: Element, swatch: string): ColorTokenRow {
  const described = describeValue(element, value);
  const chain = described.kind === "raw" ? "Not a token" : described.chain || "Not a token";
  const painted = tokenSwatch(element, value) ?? swatch;
  const computed = hexLabel(painted);
  const formula = described.detail && described.detail !== chain ? described.detail : "";
  return {
    chain,
    detail: formula ? `${formula} · ${computed}` : computed,
    inherited,
    label,
    swatch: painted
  };
}

function pushResolved(
  rows: ColorTokenRow[],
  label: string,
  element: Element,
  property: string,
  inherit: boolean,
  swatch: string,
  pseudo: Pseudo = null
) {
  if (!isVisibleColor(swatch) && property !== "color") {
    return;
  }

  const resolved = resolveProp(element, property, inherit, pseudo);
  if (!resolved) {
    if (property === "color" && isVisibleColor(swatch)) {
      rows.push({
        chain: "Not a token",
        detail: hexLabel(swatch),
        inherited: false,
        label,
        swatch
      });
    }
    return;
  }

  rows.push(rowFromValue(label, resolved.inherited, resolved.value, element, swatch));
}

function nearestPainted(element: Element, kind: "background" | "border") {
  let node: Element | null = element;
  while (node && node !== document.documentElement.parentElement) {
    const computed = getComputedStyle(node);
    if (kind === "background") {
      const paints =
        isVisibleColor(computed.backgroundColor) || (computed.backgroundImage !== "none" && computed.backgroundImage !== "");
      if (paints) {
        return node;
      }
    } else {
      const sides = ["top", "right", "bottom", "left"] as const;
      const paints = sides.some((side) => {
        const width = Number.parseFloat(computed.getPropertyValue(`border-${side}-width`));
        return width > 0 && isVisibleColor(computed.getPropertyValue(`border-${side}-color`));
      });
      if (paints) {
        return node;
      }
    }

    node = node.parentElement;
  }

  return null;
}

function pushBackground(rows: ColorTokenRow[], element: Element) {
  const owner = nearestPainted(element, "background");
  if (!owner) {
    return;
  }

  const computed = getComputedStyle(owner);
  const label = owner === element ? "Background" : `Background · ${elementLabel(owner)}`;
  if (isVisibleColor(computed.backgroundColor)) {
    pushResolved(rows, label, owner, "background-color", false, computed.backgroundColor);
    return;
  }

  if (computed.backgroundImage && computed.backgroundImage !== "none") {
    const image = resolveProp(owner, "background-image", false);
    if (image && /var\(|gradient|color-mix/i.test(image.value)) {
      rows.push(rowFromValue(label, false, image.value, owner, computed.backgroundImage));
    }
  }
}

function pushBorder(rows: ColorTokenRow[], element: Element) {
  const owner = nearestPainted(element, "border");
  if (!owner) {
    return;
  }

  const computed = getComputedStyle(owner);
  const sides = ["top", "right", "bottom", "left"] as const;
  const visible = sides.filter((side) => {
    const width = Number.parseFloat(computed.getPropertyValue(`border-${side}-width`));
    return width > 0 && isVisibleColor(computed.getPropertyValue(`border-${side}-color`));
  });
  if (visible.length === 0) {
    return;
  }

  const source = owner === element ? "" : ` · ${elementLabel(owner)}`;
  const values = visible.map((side) => resolveProp(owner, `border-${side}-color`, false)?.value ?? "");
  const same = values.every((value) => value === values[0]);
  if (same) {
    pushResolved(rows, `Border${source}`, owner, `border-${visible[0]}-color`, false, computed.getPropertyValue(`border-${visible[0]}-color`));
    return;
  }

  for (const side of visible) {
    const title = side.charAt(0).toUpperCase() + side.slice(1);
    pushResolved(
      rows,
      `Border ${title.toLowerCase()}${source}`,
      owner,
      `border-${side}-color`,
      false,
      computed.getPropertyValue(`border-${side}-color`)
    );
  }
}

function pushOutline(rows: ColorTokenRow[], element: Element) {
  const computed = getComputedStyle(element);
  const width = Number.parseFloat(computed.outlineWidth);
  if (computed.outlineStyle === "none" || width <= 0 || !isVisibleColor(computed.outlineColor)) {
    return;
  }
  pushResolved(rows, "Outline", element, "outline-color", false, computed.outlineColor);
}

function pushShadow(rows: ColorTokenRow[], element: Element) {
  const computed = getComputedStyle(element);
  if (!computed.boxShadow || computed.boxShadow === "none") {
    return;
  }

  const resolved = resolveProp(element, "box-shadow", false);
  if (!resolved || !/var\(/.test(resolved.value)) {
    return;
  }

  const swatch = computed.boxShadow.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/)?.[0] ?? "transparent";
  rows.push(rowFromValue("Shadow", false, resolved.value, element, swatch));
}

function pushSvgPaint(rows: ColorTokenRow[], element: Element, property: "fill" | "stroke") {
  if (!(element instanceof SVGElement)) {
    return;
  }

  const computed = getComputedStyle(element).getPropertyValue(property);
  if (!computed || computed === "none" || !isVisibleColor(computed)) {
    return;
  }

  const css = resolveProp(element, property, true);
  if (css && css.value !== "none") {
    rows.push(rowFromValue(property === "fill" ? "Fill" : "Stroke", css.inherited, css.value, element, computed));
    return;
  }

  let node: Element | null = element;
  let inherited = false;
  while (node instanceof SVGElement) {
    const attr = node.getAttribute(property);
    if (attr && attr !== "none" && attr !== "inherit") {
      rows.push(rowFromValue(property === "fill" ? "Fill" : "Stroke", inherited, attr, node, computed));
      return;
    }
    inherited = true;
    node = node.parentElement;
  }
}

function transformedAway(computed: CSSStyleDeclaration) {
  const transform = computed.transform;
  if (!transform || transform === "none") {
    return false;
  }
  const matrix = transform.match(/matrix\(\s*(-?[\d.]+)/);
  return matrix ? Math.abs(Number(matrix[1])) < 0.01 : false;
}

function pushPseudo(rows: ColorTokenRow[], element: Element, pseudo: Pseudo) {
  if (!pseudo) {
    return;
  }

  const computed = getComputedStyle(element, pseudo);
  if (computed.content === "none" || computed.content === "normal" || transformedAway(computed)) {
    return;
  }

  const width = Number.parseFloat(computed.width);
  const height = Number.parseFloat(computed.height);
  if ((width === 0 || height === 0) && !isVisibleColor(computed.backgroundColor)) {
    return;
  }

  const label = pseudo === "::before" ? "Before" : "After";
  if (isVisibleColor(computed.backgroundColor)) {
    pushResolved(rows, label, element, "background-color", false, computed.backgroundColor, pseudo);
  }
}

function pushText(rows: ColorTokenRow[], element: Element) {
  const specified = resolveProp(element, "color", false);
  if (!specified && !hasDirectText(element) && !(element instanceof SVGElement)) {
    return;
  }

  const computed = getComputedStyle(element).color;
  pushResolved(rows, "Text", element, "color", true, computed);
}

export function inspectElement(element: Element): ColorTokenRow[] {
  try {
    const rows: ColorTokenRow[] = [];
    pushText(rows, element);
    pushBackground(rows, element);
    pushBorder(rows, element);
    pushOutline(rows, element);
    pushShadow(rows, element);
    pushSvgPaint(rows, element, "fill");
    pushSvgPaint(rows, element, "stroke");
    const decoration = getComputedStyle(element).textDecorationLine;
    if (decoration && decoration !== "none") {
      const color = getComputedStyle(element).textDecorationColor;
      pushResolved(rows, "Underline", element, "text-decoration-color", true, color);
    }
    pushPseudo(rows, element, "::before");
    pushPseudo(rows, element, "::after");
    return rows;
  } catch {
    return [];
  }
}
