export type PortraitPose = "center" | "lookLeft" | "lookRight" | "blink" | "smile";

type Region = { x: number; y: number; w: number; h: number };

const LEFT_EYE: Region = { x: 202, y: 235, w: 36, h: 48 };
const RIGHT_EYE: Region = { x: 242, y: 235, w: 36, h: 48 };
const MOUTH: Region = { x: 196, y: 299, w: 88, h: 22 };

const INK_CUTOFF = 80;

function luminance(r: number, g: number, b: number) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function isInk(r: number, g: number, b: number) {
  return luminance(r, g, b) < INK_CUTOFF;
}

function copyPixel(
  source: Uint8ClampedArray,
  target: Uint8ClampedArray,
  width: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const from = (fromY * width + fromX) * 4;
  const to = (toY * width + toX) * 4;
  target[to] = source[from];
  target[to + 1] = source[from + 1];
  target[to + 2] = source[from + 2];
  target[to + 3] = source[from + 3];
}

function paperAt(
  base: Uint8ClampedArray,
  width: number,
  x: number,
  y: number
): [number, number, number, number] {
  const index = (y * width + x) * 4;
  return [base[index], base[index + 1], base[index + 2], base[index + 3]];
}

function setPaper(
  data: Uint8ClampedArray,
  base: Uint8ClampedArray,
  width: number,
  x: number,
  y: number
) {
  const [r, g, b, a] = paperAt(base, width, x, y);
  const index = (y * width + x) * 4;
  data[index] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = a;
}

function setInk(data: Uint8ClampedArray, width: number, x: number, y: number, ink: [number, number, number]) {
  const index = (y * width + x) * 4;
  data[index] = ink[0];
  data[index + 1] = ink[1];
  data[index + 2] = ink[2];
  data[index + 3] = 255;
}

function inkColor(base: Uint8ClampedArray, width: number, height: number): [number, number, number] {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = base[index];
      const g = base[index + 1];
      const b = base[index + 2];
      if (isInk(r, g, b)) {
        return [r, g, b];
      }
    }
  }
  return [0, 0, 0];
}

function restoreRegion(
  data: Uint8ClampedArray,
  base: Uint8ClampedArray,
  width: number,
  height: number,
  region: Region
) {
  const x0 = Math.max(0, region.x);
  const y0 = Math.max(0, region.y);
  const x1 = Math.min(width, region.x + region.w);
  const y1 = Math.min(height, region.y + region.h);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      copyPixel(base, data, width, x, y, x, y);
    }
  }
}

function shiftInkRegion(
  data: Uint8ClampedArray,
  base: Uint8ClampedArray,
  width: number,
  height: number,
  region: Region,
  dx: number
) {
  restoreRegion(data, base, width, height, region);

  const moves: Array<{ x: number; y: number; rgba: [number, number, number, number] }> = [];
  const x0 = Math.max(0, region.x);
  const y0 = Math.max(0, region.y);
  const x1 = Math.min(width, region.x + region.w);
  const y1 = Math.min(height, region.y + region.h);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const index = (y * width + x) * 4;
      if (!isInk(data[index], data[index + 1], data[index + 2])) {
        continue;
      }
      moves.push({
        x,
        y,
        rgba: [data[index], data[index + 1], data[index + 2], data[index + 3]]
      });
      setPaper(data, base, width, x, y);
    }
  }

  for (const pixel of moves) {
    const nextX = pixel.x + dx;
    if (nextX < x0 || nextX >= x1 || pixel.y < y0 || pixel.y >= y1) {
      continue;
    }
    const index = (pixel.y * width + nextX) * 4;
    data[index] = pixel.rgba[0];
    data[index + 1] = pixel.rgba[1];
    data[index + 2] = pixel.rgba[2];
    data[index + 3] = pixel.rgba[3];
  }
}

function drawEyeLid(
  data: Uint8ClampedArray,
  base: Uint8ClampedArray,
  width: number,
  height: number,
  region: Region,
  ink: [number, number, number]
) {
  restoreRegion(data, base, width, height, region);
  const centerX = region.x + Math.round(region.w * 0.45);
  const centerY = region.y + Math.round(region.h * 0.42);
  for (let x = centerX - 5; x <= centerX + 5; x++) {
    for (let y = centerY; y <= centerY + 1; y++) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        setInk(data, width, x, y, ink);
      }
    }
  }
}

function drawSmile(
  data: Uint8ClampedArray,
  base: Uint8ClampedArray,
  width: number,
  height: number,
  ink: [number, number, number]
) {
  restoreRegion(data, base, width, height, MOUTH);

  const points = [
    [205, 307],
    [208, 305],
    [212, 304],
    [220, 304],
    [228, 304],
    [236, 304],
    [244, 304],
    [252, 305],
    [256, 306],
    [259, 308],
    [204, 309],
    [207, 310],
    [211, 311],
    [219, 312],
    [227, 312],
    [235, 312],
    [243, 312],
    [251, 311],
    [255, 310],
    [258, 309],
    [203, 311],
    [206, 312],
    [210, 313],
    [218, 314],
    [226, 315],
    [234, 315],
    [242, 314],
    [250, 313],
    [254, 312],
    [257, 311]
  ] as const;

  for (const [x, y] of points) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      setInk(data, width, x, y, ink);
    }
  }
}

export function paintPortraitPose(
  ctx: CanvasRenderingContext2D,
  base: ImageData,
  pose: PortraitPose
) {
  const { width, height } = base;
  const data = new Uint8ClampedArray(base.data);
  const ink = inkColor(base.data, width, height);

  if (pose === "center") {
    ctx.putImageData(base, 0, 0);
    return;
  }

  ctx.putImageData(base, 0, 0);
  const frame = ctx.getImageData(0, 0, width, height);

  if (pose === "lookLeft") {
    shiftInkRegion(frame.data, data, width, height, LEFT_EYE, -4);
    shiftInkRegion(frame.data, data, width, height, RIGHT_EYE, -4);
  } else if (pose === "lookRight") {
    shiftInkRegion(frame.data, data, width, height, LEFT_EYE, 4);
    shiftInkRegion(frame.data, data, width, height, RIGHT_EYE, 4);
  } else if (pose === "blink") {
    drawEyeLid(frame.data, data, width, height, LEFT_EYE, ink);
    drawEyeLid(frame.data, data, width, height, RIGHT_EYE, ink);
  } else if (pose === "smile") {
    drawSmile(frame.data, data, width, height, ink);
  }

  ctx.putImageData(frame, 0, 0);
}

export const PORTRAIT_TIMELINE: Array<{ pose: PortraitPose; durationMs: number }> = [
  { pose: "center", durationMs: 2200 },
  { pose: "lookLeft", durationMs: 700 },
  { pose: "center", durationMs: 350 },
  { pose: "lookRight", durationMs: 700 },
  { pose: "center", durationMs: 350 },
  { pose: "blink", durationMs: 140 },
  { pose: "center", durationMs: 900 },
  { pose: "smile", durationMs: 1400 },
  { pose: "center", durationMs: 600 }
];

export function portraitPoseAt(elapsedMs: number): PortraitPose {
  const total = PORTRAIT_TIMELINE.reduce((sum, step) => sum + step.durationMs, 0);
  let time = elapsedMs % total;
  for (const step of PORTRAIT_TIMELINE) {
    if (time < step.durationMs) {
      return step.pose;
    }
    time -= step.durationMs;
  }
  return "center";
}