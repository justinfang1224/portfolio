"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  applyColorScheme,
  applyColorSchemeWithTransition,
  readStoredColorScheme,
  resolveColorScheme,
  type ResolvedColorScheme
} from "@/lib/color-scheme";
import { DarkThemeIcon, LightThemeIcon } from "./icons";
import styles from "./Footer.module.css";

const hongKongTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Hong_Kong"
});

function getHongKongTime() {
  const parts = hongKongTimeFormatter.formatToParts(new Date());
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  const dayPeriod = (parts.find((part) => part.type === "dayPeriod")?.value ?? "")
    .replace(/\s/g, "")
    .toUpperCase();

  return `${hour}:${minute}${dayPeriod}`;
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
    <footer className={styles.footer}>
      <p className={styles.copyright}>© 2026  •  Jenhung.work@gmail.com</p>
      <div className={styles.meta}>
        <p className={styles.location}>
          <time className={styles.time} dateTime={hongKongTime} suppressHydrationWarning>
            {hongKongTime}
          </time>
          {" HKT  •  "}
        </p>
        <button
          aria-label={nextScheme === "dark" ? "Switch to dark mode" : "Switch to light mode"}
          className={styles.themeToggle}
          onClick={() => {
            applyColorSchemeWithTransition(nextScheme);
            setColorScheme(nextScheme);
          }}
          type="button"
        >
          <span className={styles.themeIconStack}>
            <DarkThemeIcon
              aria-hidden="true"
              className={styles.themeIcon}
              data-active={isDark ? "false" : "true"}
              strokeWidth={1.8}
            />
            <LightThemeIcon
              aria-hidden="true"
              className={styles.themeIcon}
              data-active={isDark ? "true" : "false"}
              strokeWidth={1.8}
            />
          </span>
        </button>
      </div>
    </footer>
  );
}
