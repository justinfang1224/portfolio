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

    const lenis = new Lenis({
      anchors: {
        offset: -24
      },
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      wheelMultiplier: 0.9
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
