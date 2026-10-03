"use client";

/**
 * Ported from the Bencho liquid toggle (MIT — https://bencho.dev/licence).
 * Source: src/lab/Liquid.tsx `Toggle`, shown at
 * https://bencho.dev/?c=liq-toggle
 * Stretch is 40 and speed is 100. The track is 48×24, matching the
 * Figma switch, and colors use this project's tokens.
 */

import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "motion/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { playToggleSound } from "./buttonSound";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./Toggle.module.css";

const OFF_X = 2;
const ON_X = 26;
const MID_X = 14;
const STRETCH = 40;
const SPEED = 100;
const TRAVEL = ON_X - OFF_X;

const travelSpring = {
  type: "spring" as const,
  stiffness: 170 - (50 - SPEED) * 1.1,
  damping: 21.5,
  mass: 0.9
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function stretchOf(velocity: number) {
  // The original liquid toggle stretches against a 46px travel. Scale that
  // threshold with this 24px travel so the same flick still lengthens the thumb.
  const velocityCap = 600 * (TRAVEL / 46);

  return 1 + Math.min(0.4, Math.abs(velocity) / velocityCap) * (STRETCH / 100);
}

function useVelocity(source: MotionValue<number>) {
  const velocity = useMotionValue(0);

  useEffect(() => {
    let last = source.get();
    let lastTime = performance.now();

    return source.on("change", (value) => {
      const now = performance.now();
      const dt = now - lastTime;

      if (dt > 0) {
        velocity.set(((value - last) / dt) * 1000);
      }

      last = value;
      lastTime = now;
    });
  }, [source, velocity]);

  return velocity;
}

type ToggleProps = {
  "aria-label": string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

type DragState = {
  id: number;
  grab: number | null;
  moved: boolean;
};

export function Toggle({
  "aria-label": ariaLabel,
  checked,
  disabled = false,
  onChange
}: ToggleProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const activatedRef = useRef(false);
  const reducedRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(checked ? ON_X : OFF_X);
  const velocity = useSpring(useVelocity(x), { stiffness: 320, damping: 40, mass: 0.6 });
  const hoverSource = useMotionValue(1);
  const hoverScale = useSpring(hoverSource, { stiffness: 520, damping: 34, mass: 0.6 });
  const scaleX = useTransform([velocity, hoverScale], ([speed, hover]) => {
    if (reducedRef.current) {
      return 1;
    }

    return stretchOf(Number(speed)) * Number(hover);
  });
  const scaleY = useTransform([velocity, hoverScale], ([speed, hover]) => {
    if (reducedRef.current) {
      return 1;
    }

    return Number(hover) / stretchOf(Number(speed));
  });

  useEffect(() => {
    hoverSource.set(hovered && !disabled ? 1.035 : 1);
  }, [disabled, hovered, hoverSource]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedRef.current = media.matches;
    };

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (dragging) {
      return;
    }

    const target = checked ? ON_X : OFF_X;

    if (reducedRef.current) {
      x.set(target);
      return;
    }

    const controls = animate(x, target, travelSpring);

    return () => controls.stop();
  }, [checked, dragging, x]);

  const pointerToLocalX = (clientX: number) => {
    const button = buttonRef.current;

    if (!button) {
      return 0;
    }

    const rect = button.getBoundingClientRect();
    const scale = rect.width / (button.offsetWidth || rect.width) || 1;

    return (clientX - rect.left) / scale;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    dragRef.current = { id: event.pointerId, grab: null, moved: false };
    setDragging(true);

    try {
      buttonRef.current?.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail if the pointer already ended.
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;

    if (disabled || !drag || drag.id !== event.pointerId) {
      return;
    }

    const localX = pointerToLocalX(event.clientX);

    if (drag.grab === null) {
      drag.grab = localX - x.get();
    }

    const nextX = clamp(localX - drag.grab, OFF_X, ON_X);

    if (Math.abs(nextX - x.get()) > 0.4) {
      drag.moved = true;
    }

    x.set(nextX);

    const nextChecked = nextX > MID_X;

    if (nextChecked !== checked) {
      playToggleSound();
      onChange(nextChecked);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;

    if (!drag || drag.id !== event.pointerId) {
      return;
    }

    dragRef.current = null;

    try {
      buttonRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      // The pointer may already have been released.
    }

    if (!drag.moved) {
      activatedRef.current = true;
      playToggleSound();
      onChange(!checked);
    }

    setDragging(false);
  };

  const handleClick = () => {
    if (activatedRef.current) {
      activatedRef.current = false;
      return;
    }

    if (!disabled) {
      playToggleSound();
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled || (event.key !== " " && event.key !== "Enter")) {
      return;
    }

    event.preventDefault();
    activatedRef.current = true;
    playToggleSound();
    onChange(!checked);
  };

  return (
    <button
      ref={buttonRef}
      aria-checked={checked}
      aria-label={ariaLabel}
      className={styles.toggle}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="switch"
      type="button"
      {...dsMarker("Toggle")}
    >
      <span aria-hidden="true" className={styles.blobs}>
        <motion.span className={styles.thumb} style={{ x, scaleX, scaleY }} />
      </span>
    </button>
  );
}
