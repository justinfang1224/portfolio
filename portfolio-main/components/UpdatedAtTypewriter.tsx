"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./HeroIntro.module.css";

type UpdatedAtTypewriterProps = {
  value: string;
};

const CHARACTER_DELAY_RANGE_MS = {
  max: 120,
  min: 60
} as const;
const SPACE_DELAY_RANGE_MS = {
  max: 180,
  min: 90
} as const;
const PUNCTUATION_DELAY_RANGE_MS = {
  max: 280,
  min: 150
} as const;

function getRandomDelay(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function getTypingDelay(character: string) {
  if (character === " ") {
    return getRandomDelay(SPACE_DELAY_RANGE_MS.min, SPACE_DELAY_RANGE_MS.max);
  }

  if (/[,.]/.test(character)) {
    return getRandomDelay(PUNCTUATION_DELAY_RANGE_MS.min, PUNCTUATION_DELAY_RANGE_MS.max);
  }

  return getRandomDelay(CHARACTER_DELAY_RANGE_MS.min, CHARACTER_DELAY_RANGE_MS.max);
}

function splitLeadingEmoji(value: string) {
  const trimmedValue = value.trim();
  const firstSpaceIndex = trimmedValue.indexOf(" ");

  if (firstSpaceIndex === -1) {
    return {
      dateText: "",
      emoji: trimmedValue
    };
  }

  return {
    dateText: trimmedValue.slice(firstSpaceIndex + 1),
    emoji: trimmedValue.slice(0, firstSpaceIndex)
  };
}

export function UpdatedAtTypewriter({ value }: UpdatedAtTypewriterProps) {
  const { dateText, emoji } = useMemo(() => splitLeadingEmoji(value), [value]);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    const landingSplashState = document.documentElement.dataset.landingSplash;

    if (landingSplashState === "entered" || landingSplashState === "seen") {
      setShouldStartTyping(true);
      return;
    }

    const startTyping = () => {
      setShouldStartTyping(true);
    };

    window.addEventListener("portfolio:splash-complete", startTyping, { once: true });

    return () => {
      window.removeEventListener("portfolio:splash-complete", startTyping);
    };
  }, []);

  useEffect(() => {
    if (!shouldStartTyping) {
      setVisibleLength(0);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      setVisibleLength(dateText.length);
      return;
    }

    let nextVisibleLength = 0;
    let timeoutId: number;

    const typeNextCharacter = () => {
      nextVisibleLength += 1;
      setVisibleLength(nextVisibleLength);

      if (nextVisibleLength >= dateText.length) {
        return;
      }

      const currentCharacter = dateText[nextVisibleLength - 1] ?? "";
      timeoutId = window.setTimeout(typeNextCharacter, getTypingDelay(currentCharacter));
    };

    setVisibleLength(0);
    timeoutId = window.setTimeout(typeNextCharacter, getTypingDelay(dateText[0] ?? ""));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dateText, shouldStartTyping]);

  const typedText = dateText.slice(0, visibleLength);
  const isTyping = visibleLength < dateText.length;

  return (
    <p aria-label={value} className={styles.updated}>
      <span aria-hidden="true" className={styles.updatedEmoji}>
        {emoji}
      </span>
      <span aria-hidden="true" className={styles.updatedText}>
        {typedText}
      </span>
      <span
        aria-hidden="true"
        className={`${styles.typeCursor} ${isTyping ? styles.typeCursorActive : ""}`}
      />
    </p>
  );
}
