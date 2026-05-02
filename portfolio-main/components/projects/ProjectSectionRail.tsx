"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectSectionRail.module.css";

type ProjectSectionRailProps = {
  items: readonly {
    id: string;
    label: string;
  }[];
};

export function ProjectSectionRail({ items }: ProjectSectionRailProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isVisible, setIsVisible] = useState(false);

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

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
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

  return (
    <aside
      aria-hidden={!isVisible}
      aria-label="Project sections"
      className={`${styles.rail} ${isVisible ? styles.railVisible : ""}`}
    >
      <nav className={styles.nav}>
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <a
              aria-current={isActive ? "true" : undefined}
              className={isActive ? styles.activeLink : styles.link}
              href={`#${item.id}`}
              key={item.id}
              onClick={() => setActiveId(item.id)}
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
