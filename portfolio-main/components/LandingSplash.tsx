"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./LandingSplash.module.css";

const ICON_INTERVAL_MS = 200;
const FINAL_ICON_LOCK_MS = 1600;
const EXIT_START_MS = 1650;
const SPLASH_DURATION_MS = 2000;

const welcomeIcons = [
  "/images/landing/welcome-symbol-1.png",
  "/images/landing/welcome-symbol-2.png",
  "/images/landing/welcome-symbol-3.png",
  "/images/landing/welcome-union.png"
] as const;

const finalIconIndex = welcomeIcons.length - 1;

type SplashPhase = "entering" | "exiting";

function revealPortfolio() {
  document.documentElement.dataset.landingSplash = "entered";
  window.dispatchEvent(new CustomEvent("portfolio:splash-complete"));
}

export function LandingSplash() {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<SplashPhase>("entering");
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    setIsActive(true);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIconIndex(finalIconIndex);

      const reducedExitTimer = window.setTimeout(() => {
        setPhase("exiting");
      }, 240);
      const reducedDoneTimer = window.setTimeout(() => {
        revealPortfolio();
        setIsActive(false);
      }, 720);

      return () => {
        window.clearTimeout(reducedExitTimer);
        window.clearTimeout(reducedDoneTimer);
      };
    }

    const iconTimer = window.setInterval(() => {
      setIconIndex((currentIndex) => (currentIndex + 1) % welcomeIcons.length);
    }, ICON_INTERVAL_MS);

    const finalIconTimer = window.setTimeout(() => {
      window.clearInterval(iconTimer);
      setIconIndex(finalIconIndex);
    }, FINAL_ICON_LOCK_MS);

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, EXIT_START_MS);

    const doneTimer = window.setTimeout(() => {
      revealPortfolio();
      setIsActive(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearInterval(iconTimer);
      window.clearTimeout(finalIconTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <div
      aria-label="Welcome animation"
      className={`${styles.overlay} ${phase === "exiting" ? styles.overlayExiting : ""}`}
      role="status"
    >
      <div aria-label="Welcome" className={styles.word}>
        <span aria-hidden="true">Welc</span>
        <span aria-hidden="true" className={styles.iconSlot}>
          <Image
            alt=""
            className={styles.icon}
            height={96}
            key={welcomeIcons[iconIndex]}
            priority
            sizes="(max-width: 767px) 44px, 72px"
            src={welcomeIcons[iconIndex]}
            width={96}
          />
        </span>
        <span aria-hidden="true">me.</span>
      </div>
    </div>
  );
}
