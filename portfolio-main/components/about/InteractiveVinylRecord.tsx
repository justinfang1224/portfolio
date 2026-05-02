"use client";

import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./AboutFavorites.module.css";

const AUTO_PLAY_DEGREES_PER_SECOND = 22;
const FRICTION_PER_FRAME = 0.965;
const RESUME_THRESHOLD = 4;
const MAX_FRAME_DELTA_SECONDS = 0.05;

type InteractiveVinylRecordProps = {
  artist: string;
  labelAlt: string;
  labelSrc: string;
  title: string;
};

function pointerAngle(event: PointerEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
}

function shortestAngleDelta(current: number, previous: number) {
  return ((((current - previous) % 360) + 540) % 360) - 180;
}

export function InteractiveVinylRecord({
  artist,
  labelAlt,
  labelSrc,
  title
}: InteractiveVinylRecordProps) {
  const [isDragging, setIsDragging] = useState(false);
  const controlRef = useRef<HTMLButtonElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(AUTO_PLAY_DEGREES_PER_SECOND);
  const isDraggingRef = useRef(false);
  const lastFrameTimeRef = useRef<number | null>(null);
  const lastPointerAngleRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  const applyRotation = () => {
    if (discRef.current) {
      discRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
      velocityRef.current = mediaQuery.matches ? 0 : AUTO_PLAY_DEGREES_PER_SECOND;
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    let animationFrame = 0;

    const animate = (time: number) => {
      const previousTime = lastFrameTimeRef.current ?? time;
      const dt = Math.min((time - previousTime) / 1000, MAX_FRAME_DELTA_SECONDS);
      lastFrameTimeRef.current = time;

      if (!prefersReducedMotionRef.current && !isDraggingRef.current) {
        const velocity = velocityRef.current;

        if (Math.abs(velocity) > RESUME_THRESHOLD) {
          angleRef.current += velocity * dt;
          velocityRef.current = velocity * Math.pow(FRICTION_PER_FRAME, dt * 60);
        } else {
          const resumeBlend = Math.min(dt * 3, 1);
          velocityRef.current = velocity + (AUTO_PLAY_DEGREES_PER_SECOND - velocity) * resumeBlend;
          angleRef.current += velocityRef.current * dt;
        }

        applyRotation();
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      mediaQuery.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const control = controlRef.current;

    if (!control) {
      return;
    }

    event.preventDefault();
    control.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    lastPointerAngleRef.current = pointerAngle(event, control);
    lastPointerTimeRef.current = event.timeStamp;
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const control = controlRef.current;

    if (!control || !isDraggingRef.current) {
      return;
    }

    event.preventDefault();

    const nextPointerAngle = pointerAngle(event, control);
    const delta = shortestAngleDelta(nextPointerAngle, lastPointerAngleRef.current);
    const dt = Math.max((event.timeStamp - lastPointerTimeRef.current) / 1000, 0.001);

    angleRef.current += delta;
    velocityRef.current = delta / dt;
    lastPointerAngleRef.current = nextPointerAngle;
    lastPointerTimeRef.current = event.timeStamp;
    applyRotation();
  };

  const stopDragging = (event: PointerEvent<HTMLButtonElement>) => {
    const control = controlRef.current;

    if (!control || !isDraggingRef.current) {
      return;
    }

    if (control.hasPointerCapture(event.pointerId)) {
      control.releasePointerCapture(event.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <button
      aria-label={`Drag to spin ${title} by ${artist}`}
      className={`${styles.musicArtwork} ${isDragging ? styles.musicArtworkDragging : ""}`}
      onPointerCancel={stopDragging}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      ref={controlRef}
      type="button"
    >
      <span className={styles.vinylDisc} ref={discRef}>
        <span aria-hidden="true" className={styles.vinylGrooves} />
        <span aria-hidden="true" className={styles.vinylHighlight} />
        <span className={styles.recordLabel}>
          <img alt={labelAlt} draggable={false} src={labelSrc} />
        </span>
      </span>
    </button>
  );
}
