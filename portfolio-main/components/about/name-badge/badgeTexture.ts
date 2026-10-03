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
const TEX_SCALE = 4;
const TEX_W = FRAME_W * TEX_SCALE;
const TEX_H = FRAME_H * TEX_SCALE;

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
  const pick = (name: string) => styles.getPropertyValue(name).trim();
  const text = pick("--color-content-primary");
  const contrast = pick("--color-content-contrast");
  const darkInk = isLightColor(text) ? contrast : text;

  return {
    card: pick("--color-surface-card-primary"),
    background: pick("--color-background-contrast"),
    fontFamily: pick("--font-family-base") || "Inter, Helvetica, Arial, sans-serif",
    line: pick("--color-border-primary"),
    muted: pick("--color-content-tertiary"),
    photoFill: pick("--color-surface-card-secondary"),
    shadow: darkInk,
    strap: text,
    text
  };
}

function isLightColor(color: string) {
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) {
    return false;
  }
  const [r, g, b] = match.map(Number);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
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

function themePortrait(img: HTMLImageElement, palette: BadgePalette) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  const ink = parseCssColor(palette.text);
  const paper = parseCssColor(palette.photoFill);
  const grid = parseCssColor(palette.line);
  if (!ctx || !ink || !paper || !grid) {
    return img;
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0);
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    const next = luminance < 80 ? ink : luminance < 230 ? grid : paper;
    data[i] = next[0];
    data[i + 1] = next[1];
    data[i + 2] = next[2];
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

function drawCoverRoundRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  size: number,
  radius: number,
  palette: BadgePalette
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.clip();
  if (img) {
    const portrait = themePortrait(img, palette);
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
  ctx.lineWidth = Math.max(TEX_SCALE, Math.round(sy(1)));
  ctx.stroke();
}

/** 1px at the badge's on-screen size. */
const BORDER_TEXELS = Math.max(1, Math.round(TEX_W / 367));

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
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) {
    return null;
  }
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

function paintCard(ctx: CanvasRenderingContext2D, fill: string, border: string) {
  const radius = (CARD.radius / CARD.width) * TEX_W;
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = border;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.globalCompositeOperation = "destination-in";
  roundRect(ctx, 0, 0, TEX_W, TEX_H, radius);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  const inset = BORDER_TEXELS;
  roundRect(
    ctx,
    inset,
    inset,
    TEX_W - inset * 2,
    TEX_H - inset * 2,
    Math.max(0, radius - inset)
  );
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Transparent texels keep the border color so filtering does not pull in a black edge. */
function keepEdgeColor(ctx: CanvasRenderingContext2D, color: string) {
  const rgb = parseCssColor(color);
  if (!rgb) {
    return;
  }
  const [r, g, b] = rgb;
  const image = ctx.getImageData(0, 0, TEX_W, TEX_H);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }
  ctx.putImageData(image, 0, 0);
}

function drawIosEmoji(
  ctx: CanvasRenderingContext2D,
  emoji: string,
  x: number,
  y: number,
  size: number
) {
  const canvas = document.createElement("canvas");
  const pad = Math.ceil(size * 0.35);
  canvas.width = Math.ceil(size + pad * 2);
  canvas.height = canvas.width;
  const emojiCtx = canvas.getContext("2d");
  if (!emojiCtx) {
    return;
  }
  emojiCtx.clearRect(0, 0, canvas.width, canvas.height);
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
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function sx(value: number) {
  return (value * TEX_W) / FRAME_W;
}

function sy(value: number) {
  return (value * TEX_H) / FRAME_H;
}

export function createBadgeTextures({
  email = "",
  job = "",
  location = "",
  name = "",
  palette,
  photo = null
}: {
  email?: string;
  job?: string;
  location?: string;
  name?: string;
  palette: BadgePalette;
  photo?: HTMLImageElement | null;
}) {
  const nameText = name.trim() || "Name";
  const jobText = job.trim() || "Job title";
  const locationText = location.trim() || "Location";
  const emailText = email.trim() || "Email";
  const typeface = palette.fontFamily;

  const frontCanvas = document.createElement("canvas");
  frontCanvas.width = TEX_W;
  frontCanvas.height = TEX_H;
  const ctx = frontCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not draw the name badge.");
  }

  paintCard(ctx, palette.card, palette.line);

  const pad = 40;
  const photoSize = sx(180);
  const photoX = sx(FRAME_W - pad - 180);
  const photoY = sy(pad);
  drawCoverRoundRect(ctx, photo, photoX, photoY, photoSize, sx(24), palette);

  const nameSize = Math.round(sy(52));
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.letterSpacing = "-0.02em";
  ctx.font = `500 ${nameSize}px ${typeface}`;
  ctx.fillStyle = name.trim() ? palette.text : palette.muted;
  ctx.fillText(ellipsize(ctx, nameText, sx(500)), sx(pad), sy(pad + 31));

  const rowsTop = FRAME_H - pad - 204;
  const rows = [
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

    ctx.font = `600 ${valueSize}px ${typeface}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "-0.01em";
    ctx.fillStyle = row.filled ? palette.text : palette.muted;
    ctx.fillText(ellipsize(ctx, row.text, sx(360)), sx(pad + 72), sy(row.center));

    if (row.line != null) {
      ctx.fillStyle = palette.line;
      ctx.fillRect(sx(pad), sy(row.line), sx(446), Math.max(1, Math.round(sy(1))));
    }
  });

  const backCanvas = document.createElement("canvas");
  backCanvas.width = TEX_W;
  backCanvas.height = TEX_H;
  const back = backCanvas.getContext("2d");
  if (!back) {
    throw new Error("Could not draw the name badge.");
  }
  paintCard(back, palette.card, palette.line);

  if (name.trim()) {
    back.textBaseline = "middle";
    back.textAlign = "left";
    back.letterSpacing = "-0.02em";
    back.font = `500 ${nameSize}px ${typeface}`;
    back.fillStyle = palette.text;
    back.fillText(ellipsize(back, name.trim(), sx(700)), sx(40), sy(250));
  }

  keepEdgeColor(ctx, palette.line);
  keepEdgeColor(back, palette.line);

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
  ctx.globalAlpha = 0.22;
  roundRect(ctx, 90, 110, canvas.width - 180, canvas.height - 150, 40);
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
