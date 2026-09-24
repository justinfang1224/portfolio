"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      return;
    }

    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis) {
        return;
      }

      lenis = new Lenis({
        anchors: {
          offset: -24
        },
        autoRaf: true,
        lerp: 0.09,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        wheelMultiplier: 0.9
      });
    };

    if (document.documentElement.dataset.landingSplash === "entered") {
      start();
    } else {
      window.addEventListener("portfolio:splash-complete", start);
    }

    return () => {
      window.removeEventListener("portfolio:splash-complete", start);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
