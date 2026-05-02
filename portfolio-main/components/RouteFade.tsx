"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

type RouteFadeProps = {
  children: ReactNode;
};

export function RouteFade({ children }: RouteFadeProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      setIsVisible(true);
      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    const playFade = () => {
      setIsVisible(false);
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    };

    playFade();
    window.addEventListener("portfolio:splash-complete", playFade);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("portfolio:splash-complete", playFade);
    };
  }, [pathname]);

  return (
    <div className={`portfolio-route-fade ${isVisible ? "portfolio-route-fade--visible" : ""}`}>
      {children}
    </div>
  );
}
