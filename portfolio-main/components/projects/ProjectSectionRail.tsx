"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./ProjectSectionRail.module.css";

type ProjectSectionRailProps = {
  items: readonly {
    id: string;
    label: string;
  }[];
};

const SELECTION_SETTLE_MS = 180;

export function ProjectSectionRail({ items }: ProjectSectionRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const lockedIdRef = useRef<string | null>(null);
  const settleTimerRef = useRef(0);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [indicator, setIndicator] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [indicatorReady, setIndicatorReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const measureIndicator = useCallback(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>("[aria-current='true']");

    if (!nav || !active) {
      return;
    }

    setIndicator({
      x: active.offsetLeft,
      y: active.offsetTop,
      width: active.offsetWidth,
      height: active.offsetHeight
    });
  }, []);

  const releaseLockedSelection = useCallback(() => {
    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      lockedIdRef.current = null;
    }, SELECTION_SETTLE_MS);
  }, []);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const visibleId = visibleEntry?.target.id;

        if (!visibleId) {
          return;
        }

        if (lockedIdRef.current) {
          return;
        }

        setActiveId(visibleId);
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const onScroll = () => {
      if (!lockedIdRef.current) {
        return;
      }

      releaseLockedSelection();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimerRef.current);
    };
  }, [releaseLockedSelection]);

  useEffect(() => {
    const backgroundSection = document.getElementById("background");
    const trigger = backgroundSection?.querySelector("h2") ?? backgroundSection;

    if (!trigger) {
      return;
    }

    const updateVisibility = () => {
      const triggerTop = trigger.getBoundingClientRect().top;
      const revealLine = Math.min(window.innerHeight - 160, window.innerHeight * 0.72);

      setIsVisible(triggerTop <= revealLine);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    measureIndicator();
  }, [activeId, isVisible, items, measureIndicator]);

  useEffect(() => {
    const nav = navRef.current;

    if (!nav) {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureIndicator();
    });

    observer.observe(nav);

    return () => {
      observer.disconnect();
    };
  }, [activeId, items, measureIndicator]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIndicatorReady(true));

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside
      aria-hidden={!isVisible}
      aria-label="Project sections"
      className={`${styles.rail} ${isVisible ? styles.railVisible : ""}`}
      {...dsMarker("ProjectSectionRail")}
    >
      <nav
        className={[styles.nav, indicatorReady ? styles.navReady : ""].filter(Boolean).join(" ")}
        ref={navRef}
      >
        <span
          aria-hidden="true"
          className={styles.indicator}
          style={
            indicator.width === 0
              ? undefined
              : {
                  height: `${indicator.height}px`,
                  transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0px)`,
                  width: `${indicator.width}px`
                }
          }
        />
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <a
              aria-current={isActive ? "true" : undefined}
              className={isActive ? styles.activeLink : styles.link}
              href={`#${item.id}`}
              key={item.id}
              onClick={() => {
                lockedIdRef.current = item.id;
                setActiveId(item.id);
                releaseLockedSelection();
              }}
              tabIndex={isVisible ? undefined : -1}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
