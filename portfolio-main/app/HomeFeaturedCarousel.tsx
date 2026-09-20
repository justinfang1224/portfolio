"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import styles from "./page.module.css";

const carouselItems = [
  {
    alt: "Delphi AI search mobile interface shown inside a dark blue project preview.",
    image: "/images/landing/home-featured-work.png",
    status: "locked"
  },
  {
    alt: "OG.com mobile interface shown on a dark orange project preview.",
    image: "/images/landing/home-featured-og.png",
    status: "locked"
  },
  {
    alt: "Crypto.com credit card app on two phones: an Obsidian card application and the credit card balance home.",
    href: "/projects/crypto-com",
    image: "/images/landing/home-featured-credit-card.png",
    status: "live"
  },
  {
    alt: "OKX web deposit page beside a deposit details card, shown on a light project preview.",
    href: "/projects/okx",
    image: "/images/landing/home-featured-okx-deposit.png",
    status: "live"
  },
  {
    alt: "Filter badge application interface shown on a pink project preview.",
    href: "/projects/bowtie",
    image: "/images/landing/home-featured-filter-badge.png",
    status: "live"
  }
] as const;

const AUTO_ADVANCE_MS = 3000;
const DRAG_LOCK_PX = 8;
const DRAG_COMMIT_RATIO = 0.2;
const DRAG_COMMIT_VELOCITY = 0.45;
const LIGHT_BACKGROUND_LUMINANCE = 0.45;
const SLIDE_COUNT = carouselItems.length;
const SLIDE_MS = 360;
type SlideDirection = "backward" | "forward";
type SlideRole = "current" | "hidden" | "next" | "outgoing" | "prev";
type SlideTone = "dark" | "light";

type DragSession = {
  currentIndex: number;
  incomingIndex: number | null;
  intent: SlideDirection | null;
  lastTime: number;
  lastY: number;
  locked: boolean;
  offset: number;
  pointerId: number;
  startY: number;
  velocity: number;
};

function wrapIndex(index: number) {
  return (index + SLIDE_COUNT) % SLIDE_COUNT;
}

function getNeighborIndex(index: number, direction: SlideDirection) {
  return wrapIndex(index + (direction === "forward" ? 1 : -1));
}

function getSlideRole(
  index: number,
  activeIndex: number,
  previousIndex: number | null
): SlideRole {
  if (index === activeIndex) {
    return "current";
  }

  if (previousIndex != null && index === previousIndex) {
    return "outgoing";
  }

  if (index === getNeighborIndex(activeIndex, "forward")) {
    return "next";
  }

  if (index === getNeighborIndex(activeIndex, "backward")) {
    return "prev";
  }

  return "hidden";
}

function getSlideClassName(role: SlideRole, slideDirection: SlideDirection) {
  if (role === "current") {
    return styles.featuredSlideCurrent;
  }

  if (role === "next") {
    return styles.featuredSlideNext;
  }

  if (role === "prev") {
    return styles.featuredSlidePrev;
  }

  if (role === "outgoing") {
    return slideDirection === "forward"
      ? styles.featuredSlideOutgoingForward
      : styles.featuredSlideOutgoingBackward;
  }

  return styles.featuredSlideHidden;
}

function getSlideTone(image: HTMLImageElement): SlideTone {
  const canvas = document.createElement("canvas");
  const sampleSize = 32;
  canvas.height = sampleSize;
  canvas.width = sampleSize;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context || image.naturalWidth === 0 || image.naturalHeight === 0) {
    return "dark";
  }

  // Sample the left-center strip where the page switcher sits.
  context.drawImage(
    image,
    0,
    image.naturalHeight * 0.35,
    image.naturalWidth * 0.08,
    image.naturalHeight * 0.3,
    0,
    0,
    sampleSize,
    sampleSize
  );

  const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
  let luminance = 0;
  const pixelCount = sampleSize * sampleSize;

  for (let index = 0; index < pixels.length; index += 4) {
    const channel = (value: number) => {
      const normalized = value / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    luminance +=
      0.2126 * channel(pixels[index]) +
      0.7152 * channel(pixels[index + 1]) +
      0.0722 * channel(pixels[index + 2]);
  }

  return luminance / pixelCount > LIGHT_BACKGROUND_LUMINANCE ? "light" : "dark";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeFeaturedCarousel() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("forward");
  const [slideTones, setSlideTones] = useState<Partial<Record<string, SlideTone>>>({});
  const activeItem = carouselItems[activeIndex];
  const activeTone = slideTones[activeItem.image] ?? "dark";
  const activeIndexRef = useRef(activeIndex);
  const cardRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragRef = useRef<DragSession | null>(null);
  const hoveredRef = useRef(false);
  const suppressClickRef = useRef(false);
  const snapTimerRef = useRef<number | null>(null);
  const clearInlineAfterPaintRef = useRef(false);
  const listenersBoundRef = useRef(false);
  const onWindowPointerMoveRef = useRef<(event: PointerEvent) => void>(() => {});
  const onWindowPointerUpRef = useRef<(event: PointerEvent) => void>(() => {});
  const handleWindowPointerMove = useRef((event: PointerEvent) => {
    onWindowPointerMoveRef.current(event);
  }).current;
  const handleWindowPointerUp = useRef((event: PointerEvent) => {
    onWindowPointerUpRef.current(event);
  }).current;
  activeIndexRef.current = activeIndex;

  const rememberSlideTone = (src: string, image: HTMLImageElement) => {
    setSlideTones((current) => {
      if (current[src]) {
        return current;
      }

      return {
        ...current,
        [src]: getSlideTone(image)
      };
    });
  };

  const slideAt = (index: number) => slideRefs.current[index];

  const clearInlineSlideStyles = (keepTransition = false) => {
    slideRefs.current.forEach((slide) => {
      if (!slide) {
        return;
      }

      slide.style.transform = "";
      slide.style.visibility = "";
      slide.style.zIndex = "";

      if (!keepTransition) {
        slide.style.transition = "";
      }
    });
  };

  const setDraggingClass = (isDragging: boolean) => {
    cardRef.current?.classList.toggle(styles.featuredCardDragging, isDragging);
  };

  const applyDragTransforms = (
    currentIndex: number,
    incomingIndex: number,
    offset: number,
    intent: SlideDirection
  ) => {
    const current = slideAt(currentIndex);
    const incoming = slideAt(incomingIndex);
    const height = cardRef.current?.clientHeight ?? 1;
    // Keep the two slides in a vertical strip: the neighbor rides
    // just above (forward) or below (backward) the active card.
    const incomingOffset = intent === "forward" ? offset - height : offset + height;

    if (incoming) {
      incoming.style.transition = "none";
      incoming.style.transform = `translate3d(0, ${incomingOffset}px, 0)`;
      incoming.style.visibility = "visible";
      incoming.style.zIndex = "1";
    }

    if (current) {
      current.style.transition = "none";
      current.style.transform = `translate3d(0, ${offset}px, 0)`;
      current.style.zIndex = "2";
    }
  };

  const enableSlideTransitions = () => {
    const easing = prefersReducedMotion() ? "none" : `transform ${SLIDE_MS}ms var(--motion-fade-ease)`;

    slideRefs.current.forEach((slide) => {
      if (slide) {
        slide.style.transition = easing;
      }
    });
  };

  const shiftSlide = useCallback((
    direction: SlideDirection,
    animationDirection: SlideDirection = direction
  ) => {
    setActiveIndex((currentIndex) => {
      setSlideDirection(animationDirection);
      setPreviousIndex(currentIndex);
      return getNeighborIndex(currentIndex, direction);
    });
  }, []);

  const goToSlide = (nextIndex: number) => {
    setActiveIndex((currentIndex) => {
      if (nextIndex === currentIndex) {
        return currentIndex;
      }

      const forwardDistance = wrapIndex(nextIndex - currentIndex);
      const backwardDistance = wrapIndex(currentIndex - nextIndex);

      setSlideDirection(forwardDistance <= backwardDistance ? "forward" : "backward");
      setPreviousIndex(currentIndex);
      return nextIndex;
    });
  };

  const resumeAutoAdvance = () => {
    if (!hoveredRef.current && !dragRef.current) {
      setIsPaused(false);
    }
  };

  const unbindWindowListeners = () => {
    if (!listenersBoundRef.current) {
      return;
    }

    window.removeEventListener("pointermove", handleWindowPointerMove);
    window.removeEventListener("pointerup", handleWindowPointerUp);
    window.removeEventListener("pointercancel", handleWindowPointerUp);
    listenersBoundRef.current = false;
  };

  const onWindowPointerMove = (event: PointerEvent) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const offsetY = event.clientY - drag.startY;
    const elapsed = Math.max(event.timeStamp - drag.lastTime, 1);
    drag.velocity = (event.clientY - drag.lastY) / elapsed;
    drag.lastTime = event.timeStamp;
    drag.lastY = event.clientY;

    if (!drag.locked) {
      if (Math.abs(offsetY) < DRAG_LOCK_PX) {
        return;
      }

      drag.locked = true;
      suppressClickRef.current = true;
      setDraggingClass(true);
    }

    event.preventDefault();

    const height = cardRef.current?.clientHeight ?? 1;
    const offset = Math.max(-height, Math.min(height, offsetY));
    const intent: SlideDirection = offset >= 0 ? "forward" : "backward";
    const incomingIndex = getNeighborIndex(drag.currentIndex, intent);

    if (drag.incomingIndex != null && drag.incomingIndex !== incomingIndex) {
      const previousIncoming = slideAt(drag.incomingIndex);

      if (previousIncoming) {
        previousIncoming.style.transform = "";
        previousIncoming.style.transition = "";
        previousIncoming.style.visibility = "";
        previousIncoming.style.zIndex = "";
      }
    }

    drag.incomingIndex = incomingIndex;
    drag.intent = intent;
    drag.offset = offset;
    applyDragTransforms(drag.currentIndex, incomingIndex, offset, intent);
  };

  const onWindowPointerUp = (event: PointerEvent) => {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    unbindWindowListeners();
    dragRef.current = null;
    setDraggingClass(false);

    if (!drag.locked || drag.intent == null || drag.incomingIndex == null) {
      resumeAutoAdvance();
      return;
    }

    const height = cardRef.current?.clientHeight ?? 1;
    const committed =
      drag.intent === "forward"
        ? drag.offset >= height * DRAG_COMMIT_RATIO || drag.velocity >= DRAG_COMMIT_VELOCITY
        : drag.offset <= -height * DRAG_COMMIT_RATIO || drag.velocity <= -DRAG_COMMIT_VELOCITY;

    enableSlideTransitions();

    if (committed) {
      clearInlineAfterPaintRef.current = true;
      shiftSlide(drag.intent, drag.intent === "forward" ? "backward" : "forward");
      resumeAutoAdvance();
      return;
    }

    const current = slideAt(drag.currentIndex);
    const incoming = slideAt(drag.incomingIndex);
    const incomingRest = drag.intent === "forward" ? -height : height;

    if (current) {
      current.style.transform = "translate3d(0, 0, 0)";
    }

    if (incoming) {
      incoming.style.transform = `translate3d(0, ${incomingRest}px, 0)`;
    }

    if (snapTimerRef.current) {
      window.clearTimeout(snapTimerRef.current);
    }

    snapTimerRef.current = window.setTimeout(() => {
      clearInlineSlideStyles();
      snapTimerRef.current = null;
      resumeAutoAdvance();
    }, prefersReducedMotion() ? 0 : SLIDE_MS);
  };

  onWindowPointerMoveRef.current = onWindowPointerMove;
  onWindowPointerUpRef.current = onWindowPointerUp;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || SLIDE_COUNT < 2) {
      return;
    }

    if (snapTimerRef.current) {
      window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
      clearInlineSlideStyles();
    }

    unbindWindowListeners();
    suppressClickRef.current = false;
    setIsPaused(true);
    setDraggingClass(false);
    dragRef.current = {
      currentIndex: activeIndexRef.current,
      incomingIndex: null,
      intent: null,
      lastTime: event.timeStamp,
      lastY: event.clientY,
      locked: false,
      offset: 0,
      pointerId: event.pointerId,
      startY: event.clientY,
      velocity: 0
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);
    listenersBoundRef.current = true;
  };

  useLayoutEffect(() => {
    if (!clearInlineAfterPaintRef.current) {
      return;
    }

    clearInlineAfterPaintRef.current = false;
    clearInlineSlideStyles(true);
  }, [activeIndex, previousIndex]);

  useEffect(() => {
    if (isPaused || SLIDE_COUNT < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      shiftSlide("forward");
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, shiftSlide]);

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(null);
    }, SLIDE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [previousIndex]);

  useEffect(() => {
    return () => {
      unbindWindowListeners();

      if (snapTimerRef.current) {
        window.clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={styles.featuredCard}
      id="featured-work"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => {
        hoveredRef.current = true;
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        resumeAutoAdvance();
      }}
      ref={cardRef}
    >
      {carouselItems.map((item, index) => {
        const role = getSlideRole(index, activeIndex, previousIndex);
        const image = (
          <Image
            alt={item.alt}
            className={[
              styles.featuredImage,
              "href" in item ? styles.featuredImageInteractive : "",
              role === "current" ? styles.featuredImageActive : ""
            ]
              .filter(Boolean)
              .join(" ")}
            draggable={false}
            height={449}
            onLoad={(event) => rememberSlideTone(item.image, event.currentTarget)}
            priority={index === 0}
            sizes="(max-width: 767px) calc(100vw - 48px), 796px"
            src={item.image}
            width={804}
          />
        );

        return (
          <div
            className={[styles.featuredSlide, getSlideClassName(role, slideDirection)]
              .filter(Boolean)
              .join(" ")}
            key={item.image}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
          >
            {"href" in item ? (
              <Link aria-label={`Open case study: ${item.alt}`} href={item.href} tabIndex={-1}>
                {image}
              </Link>
            ) : (
              <span>{image}</span>
            )}
          </div>
        );
      })}
      <div
        aria-label={
          "href" in activeItem
            ? `Open case study: ${activeItem.alt}`
            : "Drag to switch featured work"
        }
        className={styles.featuredDragLayer}
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }

          if ("href" in activeItem) {
            router.push(activeItem.href);
          }
        }}
        onKeyDown={(event) => {
          if ((event.key !== "Enter" && event.key !== " ") || !("href" in activeItem)) {
            return;
          }

          event.preventDefault();
          router.push(activeItem.href);
        }}
        onPointerDown={handlePointerDown}
        role={"href" in activeItem ? "link" : "group"}
        tabIndex={0}
      />
      <Badge className={styles.lockedBadge} status={activeItem.status === "live" ? "positive" : "warning"}>
        {activeItem.status === "live" ? "Live" : "Locked"}
      </Badge>
      <div
        aria-label="Featured work carousel"
        className={[
          styles.slideIndicator,
          activeTone === "light" ? styles.slideIndicatorOnLight : ""
        ]
          .filter(Boolean)
          .join(" ")}
        role="tablist"
      >
        {carouselItems.map((item, index) => (
          <button
            aria-label={`Show featured work ${index + 1}`}
            aria-selected={index === activeIndex}
            className={index === activeIndex ? styles.activeSlide : ""}
            key={item.image}
            onClick={() => goToSlide(index)}
            onFocus={() => setIsPaused(true)}
            role="tab"
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
