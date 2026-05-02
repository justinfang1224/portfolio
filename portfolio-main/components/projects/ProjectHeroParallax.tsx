"use client";

import { useEffect, useRef } from "react";

type ProjectHeroParallaxProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  src: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const HERO_PARALLAX_DISTANCE = 140;
const HERO_MAX_SCROLL_SCALE = 1.25;

export function ProjectHeroParallax({
  alt,
  className,
  imageClassName,
  src
}: ProjectHeroParallaxProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!frame || !image || prefersReducedMotion.matches) {
      return;
    }

    const update = () => {
      rafRef.current = null;
      const rect = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const offset = (0.5 - progress) * HERO_PARALLAX_DISTANCE;
      const scale = 1 + progress * (HERO_MAX_SCROLL_SCALE - 1);

      image.style.transform = `translate3d(0, ${offset}px, 0) scale(${scale})`;
    };

    const requestUpdate = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className={className} ref={frameRef}>
      <img
        alt={alt}
        className={imageClassName}
        height="1258"
        ref={imageRef}
        src={src}
        width="624"
      />
    </div>
  );
}
