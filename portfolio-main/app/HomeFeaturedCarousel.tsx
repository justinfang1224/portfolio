"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    alt: "Crypto.com credit card mobile interface held in hand on a light project preview.",
    href: "/projects/crypto-com",
    image: "/images/landing/home-featured-credit-card.png",
    status: "live"
  },
  {
    alt: "OKX deposit flow desktop interface shown on a light project preview.",
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
type SlideDirection = "backward" | "forward";

export function HomeFeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>("forward");
  const activeItem = carouselItems[activeIndex];

  const goToSlide = (nextIndex: number) => {
    setActiveIndex((currentIndex) => {
      if (nextIndex === currentIndex) {
        return currentIndex;
      }

      setSlideDirection(nextIndex > currentIndex ? "forward" : "backward");
      setPreviousIndex(currentIndex);
      return nextIndex;
    });
  };

  useEffect(() => {
    if (isPaused || carouselItems.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % carouselItems.length;

        setSlideDirection(nextIndex > currentIndex ? "forward" : "backward");
        setPreviousIndex(currentIndex);
        return nextIndex;
      });
    }, AUTO_ADVANCE_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(null);
    }, 360);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [previousIndex]);

  return (
    <div
      className={styles.featuredCard}
      id="featured-work"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {carouselItems.map((item, index) => {
        const image = (
          <Image
            alt={item.alt}
            className={[
              styles.featuredImage,
              "href" in item ? styles.featuredImageInteractive : "",
              index === activeIndex ? styles.featuredImageActive : "",
              index === previousIndex && slideDirection === "forward" ? styles.featuredImagePreviousForward : "",
              index === previousIndex && slideDirection === "backward" ? styles.featuredImagePreviousBackward : "",
              index !== activeIndex && index !== previousIndex && index < activeIndex ? styles.featuredImageInactiveBefore : "",
              index !== activeIndex && index !== previousIndex && index > activeIndex ? styles.featuredImageInactiveAfter : ""
            ]
              .filter(Boolean)
              .join(" ")}
            height={449}
            priority={index === 0}
            sizes="(max-width: 767px) calc(100vw - 48px), 796px"
            src={item.image}
            width={804}
          />
        );

        if ("href" in item) {
          return (
            <Link aria-label={`Open case study: ${item.alt}`} href={item.href} key={item.image}>
              {image}
            </Link>
          );
        }

        return <span key={item.image}>{image}</span>;
      })}
      <Badge className={styles.lockedBadge} status={activeItem.status === "live" ? "positive" : "warning"}>
        {activeItem.status === "live" ? "Live" : "Locked"}
      </Badge>
      <div aria-label="Featured work carousel" className={styles.slideIndicator} role="tablist">
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
