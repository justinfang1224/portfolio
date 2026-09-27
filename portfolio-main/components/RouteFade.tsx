"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { scrollToTopImmediate } from "@/lib/scroll-reset";

type RouteFadeProps = {
  children: ReactNode;
};

function routeContentReady() {
  return Boolean(document.querySelector(".portfolio-route-fade main"));
}

export function RouteFade({ children }: RouteFadeProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    scrollToTopImmediate();
    setIsVisible(false);
    const frame = window.requestAnimationFrame(scrollToTopImmediate);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let attempts = 0;
    let cancelled = false;

    const reveal = () => {
      if (cancelled) {
        return;
      }

      scrollToTopImmediate();

      // Pages such as Projects suspend for a frame and would otherwise
      // leave only the footer in view. Wait until the page content exists.
      if (!routeContentReady() && attempts < 45) {
        attempts += 1;
        frame = window.requestAnimationFrame(reveal);
        return;
      }

      setIsVisible(true);
    };

    const playFade = () => {
      scrollToTopImmediate();
      setIsVisible(false);
      attempts = 0;
      window.cancelAnimationFrame(frame);

      if (prefersReducedMotion.matches) {
        reveal();
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(reveal);
      });
    };

    playFade();
    window.addEventListener("portfolio:splash-complete", playFade);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("portfolio:splash-complete", playFade);
    };
  }, [pathname]);

  return (
    <div className={`portfolio-route-fade ${isVisible ? "portfolio-route-fade--visible" : ""}`}>
      {children}
    </div>
  );
}
