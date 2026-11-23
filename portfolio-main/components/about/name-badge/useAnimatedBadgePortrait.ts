"use client";

import { useEffect, useRef, useState } from "react";
import { paintPortraitPose, portraitPoseAt } from "./portraitAnimation";

const FRAME_MS = 125;

export function useAnimatedBadgePortrait(src: string | null | undefined) {
  const baseRef = useRef<ImageData | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src || typeof window === "undefined") {
      setReady(false);
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let live = true;
    let raf = 0;
    let lastFrame = 0;
    let startedAt = performance.now();

    const img = new Image();
    img.decoding = "async";

    const begin = () => {
      if (!live) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        return;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
      baseRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setCanvas(canvas);
      setReady(true);
      setTick((value) => value + 1);

      if (reducedMotion) {
        return;
      }

      const frame = (now: number) => {
        if (!live || !canvas || !baseRef.current) {
          return;
        }
        if (now - lastFrame >= FRAME_MS) {
          lastFrame = now;
          const poseCtx = canvas.getContext("2d", { willReadFrequently: true });
          if (poseCtx) {
            paintPortraitPose(poseCtx, baseRef.current, portraitPoseAt(now - startedAt));
            setTick((value) => value + 1);
          }
        }
        raf = window.requestAnimationFrame(frame);
      };

      raf = window.requestAnimationFrame(frame);
    };

    img.onload = () => {
      const decoded = typeof img.decode === "function" ? img.decode() : Promise.resolve();
      decoded.then(begin, begin);
    };
    img.onerror = () => {
      if (live) {
        setReady(false);
      }
    };
    img.src = src;

    return () => {
      live = false;
      window.cancelAnimationFrame(raf);
      setCanvas(null);
      setReady(false);
    };
  }, [src]);

  return {
    canvas: ready ? canvas : null,
    tick,
    ready
  };
}