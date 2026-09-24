"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  applyColorScheme,
  applyColorSchemeWithTransition,
  readStoredColorScheme,
  resolveColorScheme,
  type ResolvedColorScheme
} from "@/lib/color-scheme";
import { dsMarker } from "@/lib/ds-marker";
import { Button } from "./Button";
import styles from "./Footer.module.css";

const hongKongTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Hong_Kong"
});

function getHongKongTime() {
  return hongKongTimeFormatter.format(new Date());
}

export function Footer() {
  const [hongKongTime, setHongKongTime] = useState(() => getHongKongTime());
  const [colorScheme, setColorScheme] = useState<ResolvedColorScheme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return resolveColorScheme(readStoredColorScheme());
  });

  useLayoutEffect(() => {
    const stored = readStoredColorScheme();
    const resolved = resolveColorScheme(stored);

    if (stored !== "system") {
      applyColorScheme(stored);
    }

    setColorScheme(resolved);
  }, []);

  useEffect(() => {
    setHongKongTime(getHongKongTime());

    const timer = window.setInterval(() => {
      setHongKongTime(getHongKongTime());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const nextScheme: ResolvedColorScheme = colorScheme === "dark" ? "light" : "dark";
  const isDark = colorScheme === "dark";

  return (
    <footer className={styles.footer} {...dsMarker("Footer")}>
      <p className={styles.copyright}>© 2026  •  Jenhung.work@gmail.com</p>
      <div className={styles.meta}>
        <p className={styles.location}>
          <time className={styles.time} dateTime={hongKongTime} suppressHydrationWarning>
            {hongKongTime}
          </time>
          {" HKT  •"}
        </p>
        <Button
          aria-label={nextScheme === "dark" ? "Switch to dark mode" : "Switch to light mode"}
          onClick={() => {
            applyColorSchemeWithTransition(nextScheme);
            setColorScheme(nextScheme);
          }}
          variant="text"
        >
          {isDark ? "Light" : "Dark"}
        </Button>
      </div>
    </footer>
  );
}
