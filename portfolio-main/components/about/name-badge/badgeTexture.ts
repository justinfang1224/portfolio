import * as THREE from "three";

export const CARD = {
  width: 1.22,
  height: 0.76,
  top: 1.018,
  depth: 0.014,
  radius: 0.058
};

export const CARD_CENTER_Y = CARD.top - CARD.height / 2;

const FRAME_W = 803;
const FRAME_H = 500;

export type BadgePalette = {
  background: string;
  card: string;
  fontFamily: string;
  line: string;
  muted: string;
  photoFill: string;
  shadow: string;
  strap: string;
  text: string;
};

export function readBadgePalette(): BadgePalette {
  const styles = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  const text = pick("--color-content-primary", "#111111");

  return {
    background: pick("--color-background-contrast", "#FFFFFF"),
    card: pick("--color-surface-card-primary", "#F7F7F7"),
    fontFamily: pick("--font-family-base", '"SF Pro Text", "SF Pro Display", Helvetica, Arial, sans-serif'),
    line: pick("--color-border-primary", "#EDEDED"),
    muted: pick("--color-content-tertiary", "#B3B3B3"),
    photoFill: pick("--color-surface-card-secondary", "#F0F0F0"),
    shadow: text,
    strap: text,
    text
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }
  let value = text;
  while (value.length > 1 && ctx.measureText(`${value}…`).width > maxWidth) {
    value = value.slice(0, -1);
  }
  return `${value}…`;
}

function parseCssColor(color: string): [number, number, number] | null {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const value =
      hex[1].length === 3
        ? hex[1]
            .split("")
            .map((channel) => channel + channel)
            .join("")
        : hex[1];
    return [
      Number.parseInt(value.slice(0, 2), 16),
      Number.parseInt(value.slice(2, 4), 16),
      Number.parseInt(value.slice(4, 6), 16)
    ];
  }
  const channels = color.match(/\d+/g);
  if (!channels || channels.length < 3) {
    return null;
  }
  return [Number(channels[0]), Number(channels[1]), Number(channels[2])];
}

/** Recolors the pixel portrait so ink, grid, and paper follow the theme tokens. */
function themePortrait(img: HTMLImageElement, palette: BadgePalette) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const portrait = canvas.getContext("2d");
  const ink = parseCssColor(palette.text);
  const paper = parseCssColor(palette.card);
  const grid = parseCssColor(palette.line);
  if (!portrait || !ink || !paper || !grid) {
    return img;
  }
  portrait.imageSmoothingEnabled = false;
  portrait.drawImage(img, 0, 0);
  const image = portrait.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    const next = luminance < 80 ? ink : luminance < 228 ? grid : paper;
    data[i] = next[0];
    data[i + 1] = next[1];
    data[i + 2] = next[2];
  }
  portrait.putImageData(image, 0, 0);
  return canvas;
}

function drawCoverRoundRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement | null,
  x: number,
  y: number,
  size: number,
  radius: number,
  lineWidth: number,
  palette: BadgePalette
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.clip();
  if (img) {
    const portrait = img instanceof HTMLImageElement ? themePortrait(img, palette) : img;
    ctx.imageSmoothingEnabled = false;
    const scale = Math.max(size / portrait.width, size / portrait.height);
    const dw = portrait.width * scale;
    const dh = portrait.height * scale;
    ctx.drawImage(portrait, x + (size - dw) / 2, y + (size - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = palette.photoFill;
    ctx.fill();
  }
  ctx.restore();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.strokeStyle = palette.line;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function paintCard(ctx: CanvasRenderingContext2D, texW: number, texH: number, fill: string) {
  ctx.clearRect(0, 0, texW, texH);
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, texW, texH);
}

/** Recolors every see-through pixel so the edge cannot blend toward black. */
function bleedHiddenPixels(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, bleed: [number, number, number]) {
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] === 255) {
      continue;
    }
    data[i - 3] = bleed[0];
    data[i - 2] = bleed[1];
    data[i - 1] = bleed[2];
  }
  ctx.putImageData(image, 0, 0);
}

function drawIosEmoji(ctx: CanvasRenderingContext2D, emoji: string, x: number, y: number, size: number) {
  const canvas = document.createElement("canvas");
  const pad = Math.ceil(size * 0.35);
  canvas.width = Math.ceil(size + pad * 2);
  canvas.height = canvas.width;
  const emojiCtx = canvas.getContext("2d");
  if (!emojiCtx) {
    return;
  }
  emojiCtx.clearRect(0, 0, canvas.width, canvas.height);
  emojiCtx.globalAlpha = 1;
  emojiCtx.fillStyle = "#000000";
  emojiCtx.font = `${size}px "Apple Color Emoji"`;
  emojiCtx.textAlign = "center";
  emojiCtx.textBaseline = "middle";
  emojiCtx.fillText(emoji, canvas.width / 2, canvas.height / 2);
  ctx.drawImage(canvas, x - pad, y - canvas.height / 2);
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.premultiplyAlpha = false;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function drawingContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    throw new Error("Could not draw the name badge.");
  }
  return context;
}

export function createBadgeTextures({
  name = "",
  job = "",
  location = "",
  email = "",
  photo = null,
  pixelWidth = FRAME_W * 2,
  palette
}: {
  name?: string;
  job?: string;
  location?: string;
  email?: string;
  photo?: HTMLImageElement | null;
  pixelWidth?: number;
  palette: BadgePalette;
}) {
  const texW = Math.round(Math.min(4096, Math.max(pixelWidth, 2)));
  const texH = Math.round(texW * (FRAME_H / FRAME_W));
  const sx = (value: number) => (value * texW) / FRAME_W;
  const sy = (value: number) => (value * texH) / FRAME_H;
  const hairline = Math.max(1, Math.round(sy(1)));

  const nameText = name.trim() || "Name";
  const jobText = job.trim() || "Job title";
  const locationText = location.trim() || "Location";
  const emailText = email.trim() || "Email";

  const frontCanvas = document.createElement("canvas");
  frontCanvas.width = texW;
  frontCanvas.height = texH;
  const ctx = drawingContext(frontCanvas);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  paintCard(ctx, texW, texH, palette.card);

  const pad = 40;
  const photoSize = sx(180);
  const photoX = sx(FRAME_W - pad - 180);
  const photoY = sy(pad);
  drawCoverRoundRect(ctx, photo, photoX, photoY, photoSize, sx(24), hairline, palette);

  const nameSize = Math.round(sy(52));
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.letterSpacing = "-0.02em";
  ctx.font = `500 ${nameSize}px ${palette.fontFamily}`;
  ctx.fillStyle = name.trim() ? palette.text : palette.muted;
  ctx.fillText(ellipsize(ctx, nameText, sx(500)), sx(pad), sy(pad + 31));

  const rowsTop = FRAME_H - pad - 204;
  const rows: Array<{
    icon: string;
    text: string;
    filled: boolean;
    center: number;
    line: number | null;
  }> = [
    { icon: "🌐", text: locationText, filled: Boolean(location.trim()), center: rowsTop + 18, line: rowsTop + 60 },
    { icon: "🖥️", text: jobText, filled: Boolean(job.trim()), center: rowsTop + 102, line: rowsTop + 144 },
    { icon: "✉️", text: emailText, filled: Boolean(email.trim()), center: rowsTop + 186, line: null }
  ];
  const valueSize = Math.round(sy(28));
  const iconSize = Math.round(sy(36));

  rows.forEach((row) => {
    ctx.save();
    ctx.globalAlpha = 1;
    drawIosEmoji(ctx, row.icon, sx(pad), sy(row.center), iconSize);
    ctx.restore();

    ctx.font = `600 ${valueSize}px ${palette.fontFamily}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "-0.01em";
    ctx.fillStyle = row.filled ? palette.text : palette.muted;
    ctx.fillText(ellipsize(ctx, row.text, sx(360)), sx(pad + 72), sy(row.center));

    if (row.line != null) {
      ctx.fillStyle = palette.line;
      ctx.fillRect(sx(pad), sy(row.line), sx(446), hairline);
    }
  });

  const backCanvas = document.createElement("canvas");
  backCanvas.width = texW;
  backCanvas.height = texH;
  const back = drawingContext(backCanvas);
  back.imageSmoothingEnabled = true;
  back.imageSmoothingQuality = "high";
  paintCard(back, texW, texH, palette.card);

  if (name.trim()) {
    back.textBaseline = "middle";
    back.textAlign = "left";
    back.letterSpacing = "-0.02em";
    back.font = `500 ${nameSize}px ${palette.fontFamily}`;
    back.fillStyle = palette.text;
    back.fillText(ellipsize(back, name.trim(), sx(700)), sx(40), sy(250));
  }

  const faceRgb = parseCssColor(palette.card) ?? [247, 247, 247];
  bleedHiddenPixels(ctx, frontCanvas, faceRgb);
  bleedHiddenPixels(back, backCanvas, faceRgb);

  return {
    front: makeTexture(frontCanvas),
    back: makeTexture(backCanvas)
  };
}

export function createBadgeGeometry() {
  const { width, height, radius, depth } = CARD;
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 20
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

/** Soft contact shadow under the card — not a corner halo. */
export function createContactShadowTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not draw the name badge shadow.");
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = "blur(28px)";
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.18;
  roundRect(ctx, 90, 110, canvas.width - 180, canvas.height - 150, 40);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
