"use client";

import { useEffect, useState } from "react";
import { WanderingEyes } from "./WanderingEyes";
import styles from "./LandingSplash.module.css";

const EXIT_START_MS = 1650;
const SPLASH_DURATION_MS = 2000;

type SplashPhase = "entering" | "exiting";

function revealPortfolio() {
  window.scrollTo(0, 0);
  document.documentElement.dataset.landingSplash = "entered";
  window.dispatchEvent(new CustomEvent("portfolio:splash-complete"));
}

export function LandingSplash() {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<SplashPhase>("entering");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitAt = prefersReducedMotion ? 240 : EXIT_START_MS;
    const doneAt = prefersReducedMotion ? 720 : SPLASH_DURATION_MS;

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, exitAt);
    const doneTimer = window.setTimeout(() => {
      revealPortfolio();
      setIsActive(false);
    }, doneAt);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${phase === "exiting" ? styles.overlayExiting : ""}`}>
      <div className={styles.mark}>
        <WanderingEyes />
      </div>
    </div>
  );
}
