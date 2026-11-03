"use client";

import { useLayoutEffect, useState } from "react";
import styles from "./TextScramble.module.css";

type TextScrambleProps = {
  text: string;
};

const SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+?/@";
const TICK_MS = 46;
const LOCK_START_MS = 320;
const LOCK_STAGGER_MS = 78;

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] ?? "#";
}

function scrambled(characters: string[]) {
  return characters.map((character) => (character === " " ? character : randomSymbol()));
}

export function TextScramble({ text }: TextScrambleProps) {
  const [glyphs, setGlyphs] = useState(() => Array.from(text));

  useLayoutEffect(() => {
    const characters = Array.from(text);
    let timer = 0;
    let cancelled = false;

    const stop = () => {
      cancelled = true;
      window.clearTimeout(timer);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGlyphs(characters);
      return stop;
    }

    const run = () => {
      const startedAt = performance.now();

      const step = () => {
        if (cancelled) {
          return;
        }

        const elapsed = performance.now() - startedAt;
        let done = true;
        const next = characters.map((character, index) => {
          if (character === " ") {
            return character;
          }

          if (elapsed >= LOCK_START_MS + index * LOCK_STAGGER_MS) {
            return character;
          }

          done = false;
          return randomSymbol();
        });

        setGlyphs(next);

        if (!done) {
          timer = window.setTimeout(step, TICK_MS);
        }
      };

      step();
    };

    const splash = document.documentElement.dataset.landingSplash;

    if (splash === "entered" || splash === "seen") {
      run();
    } else {
      setGlyphs(scrambled(characters));
      window.addEventListener("portfolio:splash-complete", run, { once: true });
    }

    return () => {
      stop();
      window.removeEventListener("portfolio:splash-complete", run);
    };
  }, [text]);

  return (
    <span aria-hidden="true" className={styles.scramble}>
      {glyphs.map((glyph, index) => (
        <span className={styles.slot} key={`${text}-${index}`}>
          <span className={styles.sizer}>{text[index]}</span>
          <span className={styles.face}>{glyph}</span>
        </span>
      ))}
    </span>
  );
}
