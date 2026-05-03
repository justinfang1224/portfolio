"use client";

import Image from "next/image";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent
} from "react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import { aboutCollageImages } from "@/content/about";
import styles from "./AboutCollage.module.css";

export function AboutCollage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [hoveredSelectedIndex, setHoveredSelectedIndex] = useState<number | null>(null);
  const collageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedIndex === null) {
      setHoveredSelectedIndex(null);
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const selectedCard = collageRef.current?.querySelector<HTMLElement>(`.${styles.selected}`);

      if (selectedCard?.contains(event.target as Node)) {
        return;
      }

      setSelectedIndex(null);
      setFlippedIndex(null);
      setHoveredSelectedIndex(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        setFlippedIndex(null);
        setHoveredSelectedIndex(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const handleCardClick = (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    if (event.detail > 0) {
      updateCursorPosition(event);
      setHoveredSelectedIndex(index);
    }

    if (selectedIndex !== index) {
      setSelectedIndex(index);
      setFlippedIndex(null);
      return;
    }

    setFlippedIndex(flippedIndex === index ? null : index);
  };

  const updateCursorPosition = (
    event: ReactMouseEvent<HTMLButtonElement> | ReactPointerEvent<HTMLButtonElement>
  ) => {
    const cardBounds = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty("--cursor-x", `${event.clientX - cardBounds.left}px`);
    event.currentTarget.style.setProperty("--cursor-y", `${event.clientY - cardBounds.top}px`);
  };

  const handleCardPointerEnter = (
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    if (selectedIndex !== index) {
      return;
    }

    updateCursorPosition(event);
    setHoveredSelectedIndex(index);
  };

  const handleCardPointerMove = (
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    if (selectedIndex !== index) {
      return;
    }

    updateCursorPosition(event);
    setHoveredSelectedIndex(index);
  };

  const handleCardPointerLeave = (index: number) => {
    if (hoveredSelectedIndex === index) {
      setHoveredSelectedIndex(null);
    }
  };

  const getCardLabel = (image: (typeof aboutCollageImages)[number], index: number) => {
    if (selectedIndex !== index) {
      return `Enlarge photo: ${image.alt}`;
    }

    if (flippedIndex === index) {
      return `Show photo side: ${image.alt}`;
    }

    return `Show back side: ${image.back.title}`;
  };

  return (
    <div
      aria-label="About Justin photo collage"
      className={[
        styles.collage,
        selectedIndex !== null ? styles.expanded : "",
        selectedIndex !== null ? styles[`selected${selectedIndex + 1}`] : ""
      ]
        .filter(Boolean)
        .join(" ")}
      ref={collageRef}
    >
      {aboutCollageImages.map((image, index) => {
        const isSelected = selectedIndex === index;
        const showCustomCursor = hoveredSelectedIndex === index && isSelected;

        return (
          <button
            aria-label={getCardLabel(image, index)}
            aria-pressed={isSelected}
            className={[
              styles.card,
              styles[image.className],
              isSelected ? styles.selected : "",
              selectedIndex !== null && !isSelected ? styles.stacked : "",
              flippedIndex === index ? styles.flipped : "",
              showCustomCursor ? styles.customCursorActive : ""
            ]
              .filter(Boolean)
              .join(" ")}
            key={image.src}
            onClick={(event) => handleCardClick(index, event)}
            onPointerEnter={(event) => handleCardPointerEnter(index, event)}
            onPointerLeave={() => handleCardPointerLeave(index)}
            onPointerMove={(event) => handleCardPointerMove(index, event)}
            type="button"
          >
            <span className={styles.flipInner}>
              <span className={`${styles.face} ${styles.frontFace}`}>
                <Image
                  alt={image.alt}
                  height={251}
                  sizes="(max-width: 767px) 150px, 188px"
                  src={image.src}
                  width={188}
                />
              </span>
              <span className={`${styles.face} ${styles.backFace}`}>
                <span className={styles.backTitle} title={image.back.title}>
                  {image.back.title}
                </span>
                <span className={styles.backBody} title={image.back.body}>
                  {image.back.body}
                </span>
              </span>
            </span>
            {showCustomCursor ? (
              <span aria-hidden="true" className={styles.magneticCursor}>
                <Badge className={styles.magneticCursorBadge}>
                  Flip ↺
                </Badge>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
