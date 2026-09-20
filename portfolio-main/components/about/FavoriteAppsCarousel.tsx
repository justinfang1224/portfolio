"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent
} from "react";
import styles from "./AboutFavorites.module.css";

type FavoriteApp = {
  alt: string;
  href: string;
  src: string;
};

type FavoriteAppsCarouselProps = {
  items: readonly FavoriteApp[];
};

const AUTO_SPEED_PX_PER_SEC = 348 / 8.8;
const DRAG_THRESHOLD_PX = 3;
const INERTIA_FRICTION = 0.92;
const INERTIA_MIN_VELOCITY = 0.02;

function wrapTranslate(offset: number, loop: number) {
  if (loop <= 0) {
    return offset;
  }

  const normalized = ((offset % loop) + loop) % loop;
  return normalized === 0 ? 0 : normalized - loop;
}

export function FavoriteAppsCarousel({ items }: FavoriteAppsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopRef = useRef(348);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    origin: number;
    lastX: number;
    lastTime: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const inertiaRafRef = useRef(0);
  const autoRafRef = useRef(0);
  const suppressClickRef = useRef(false);
  const [held, setHeld] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const paint = () => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.style.transform = `translate3d(${wrapTranslate(offsetRef.current, loopRef.current)}px, 0, 0)`;
  };

  const measureLoop = () => {
    const group = firstGroupRef.current;
    const track = trackRef.current;
    if (!group || !track) {
      return;
    }

    const groupWidth = group.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
    loopRef.current = groupWidth + gap;
  };

  useLayoutEffect(() => {
    measureLoop();
    paint();

    const onResize = () => {
      measureLoop();
      paint();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(autoRafRef.current);

    if (held || hovered || reducedMotion) {
      return;
    }

    let previous = 0;
    const step = (time: number) => {
      if (previous) {
        offsetRef.current -= ((time - previous) / 1000) * AUTO_SPEED_PX_PER_SEC;
        paint();
      }
      previous = time;
      autoRafRef.current = requestAnimationFrame(step);
    };

    autoRafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(autoRafRef.current);
  }, [held, hovered, reducedMotion]);

  useEffect(() => () => {
    cancelAnimationFrame(autoRafRef.current);
    cancelAnimationFrame(inertiaRafRef.current);
  }, []);

  const stopInertia = () => {
    cancelAnimationFrame(inertiaRafRef.current);
    inertiaRafRef.current = 0;
  };

  const startInertia = (velocityPxPerMs: number) => {
    stopInertia();
    let velocity = velocityPxPerMs;
    let previous = performance.now();

    const step = (time: number) => {
      const dt = Math.max(1, time - previous);
      previous = time;

      if (Math.abs(velocity) < INERTIA_MIN_VELOCITY) {
        setHeld(false);
        return;
      }

      offsetRef.current += velocity * dt;
      velocity *= INERTIA_FRICTION;
      paint();
      inertiaRafRef.current = requestAnimationFrame(step);
    };

    inertiaRafRef.current = requestAnimationFrame(step);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    stopInertia();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      origin: offsetRef.current,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false
    };
    setHeld(true);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* pointer capture unavailable */
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD_PX) {
      drag.moved = true;
    }

    const dt = Math.max(1, event.timeStamp - drag.lastTime);
    drag.velocity = (drag.velocity + (event.clientX - drag.lastX) / dt) / 2;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;

    offsetRef.current = drag.origin + dx;
    paint();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;

    if (drag.moved) {
      suppressClickRef.current = true;
      startInertia(drag.velocity);
      return;
    }

    setHeld(false);
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <div
      aria-label="Favorite apps carousel"
      className={styles.appCarousel}
      data-held={held ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClickCapture={onClickCapture}
      onPointerCancel={onPointerUp}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="group"
    >
      <div className={styles.appTrack} ref={trackRef}>
        {[0, 1].map((groupIndex) => (
          <div
            aria-hidden={groupIndex === 1 ? "true" : undefined}
            className={styles.appGroup}
            key={groupIndex}
            ref={groupIndex === 0 ? firstGroupRef : undefined}
          >
            {items.map((app) => (
              <a
                className={[
                  styles.appLogo,
                  app.src.endsWith("favorite-app-6.png") ? styles.spotifyAppLogo : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                draggable={false}
                href={app.href}
                key={`${groupIndex}-${app.src}`}
                rel="noopener noreferrer"
                tabIndex={groupIndex === 1 ? -1 : undefined}
                target="_blank"
              >
                <img alt={groupIndex === 0 ? app.alt : ""} draggable={false} src={app.src} />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
