"use client";

import { useCallback, useEffect, useRef, useState, type TransitionEvent } from "react";
import { Button } from "@/components/Button";
import { SettingsIcon } from "@/components/icons";
import styles from "./DesignSystemAudit.module.css";

const STORAGE_KEY = "portfolio-ds-audit";
const MENU_GAP_PX = 8;

type HighlightBox = {
  height: number;
  left: number;
  name: string;
  top: number;
  width: number;
};

type StoredState = {
  enabled: boolean;
  grid: boolean;
};

function readStoredState(): StoredState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { enabled: false, grid: false };
    }

    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      enabled: Boolean(parsed.enabled),
      grid: Boolean(parsed.grid)
    };
  } catch {
    return { enabled: false, grid: false };
  }
}

function writeStoredState(state: StoredState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing can block storage.
  }
}

function collectHighlights(): HighlightBox[] {
  const nodes = document.querySelectorAll<HTMLElement>("[data-ds-component]");
  const boxes: HighlightBox[] = [];

  nodes.forEach((node) => {
    const name = node.getAttribute("data-ds-component");
    if (!name) {
      return;
    }

    if (node.closest("[data-ds-audit-root]")) {
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) {
      return;
    }

    boxes.push({
      height: rect.height,
      left: rect.left,
      name,
      top: rect.top,
      width: rect.width
    });
  });

  return boxes;
}

export function DesignSystemAudit() {
  const [enabled, setEnabled] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const [menuAbove, setMenuAbove] = useState(false);
  const [highlights, setHighlights] = useState<HighlightBox[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const menuShownRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = readStoredState();
    setEnabled(stored.enabled);
    setGridEnabled(stored.grid);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeStoredState({ enabled, grid: gridEnabled });
  }, [enabled, gridEnabled, hydrated]);

  const refreshHighlights = useCallback(() => {
    if (!enabled) {
      setHighlights([]);
      return;
    }

    const next = collectHighlights();
    setHighlights((current) => {
      if (
        current.length === next.length &&
        current.every(
          (box, index) =>
            box.name === next[index]?.name &&
            box.left === next[index]?.left &&
            box.top === next[index]?.top &&
            box.width === next[index]?.width &&
            box.height === next[index]?.height
        )
      ) {
        return current;
      }

      return next;
    });
  }, [enabled]);

  useEffect(() => {
    refreshHighlights();

    if (!enabled) {
      return;
    }

    let frameId = 0;
    const scheduleRefresh = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        refreshHighlights();
      });
    };

    const root = document.querySelector(".portfolio-content-shell") ?? document.body;

    window.addEventListener("scroll", scheduleRefresh, { passive: true, capture: true });
    window.addEventListener("resize", scheduleRefresh);

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(root, {
      attributes: true,
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener("scroll", scheduleRefresh, true);
      window.removeEventListener("resize", scheduleRefresh);
      observer.disconnect();
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [enabled, refreshHighlights]);

  useEffect(() => {
    if (menuOpen) {
      setMenuRendered(true);
      return;
    }

    if (!menuShownRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuShown(false);
      setMenuRendered(false);
      return;
    }

    setMenuShown(false);
  }, [menuOpen]);

  useEffect(() => {
    menuShownRef.current = menuShown;
  }, [menuShown]);

  useEffect(() => {
    if (!menuOpen || !menuRendered) {
      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setMenuShown(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [menuOpen, menuRendered]);

  const handleMenuTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "opacity" || menuOpen) {
      return;
    }

    setMenuRendered(false);
  };

  const updateMenuPlacement = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP_PX;
    setMenuAbove(spaceBelow < 120 && rect.top > spaceBelow);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    updateMenuPlacement();

    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateMenuPlacement);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateMenuPlacement);
    };
  }, [menuOpen, updateMenuPlacement]);

  if (!hydrated) {
    return null;
  }

  return (
    <>
      <div className={styles.root} data-ds-audit-root ref={rootRef}>
        <div className={styles.trigger} ref={triggerRef}>
          <Button
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Dev menu"
            onClick={() => setMenuOpen((current) => !current)}
            size="icon"
          >
            <SettingsIcon aria-hidden="true" strokeWidth={1.8} />
          </Button>
        </div>

        {menuRendered ? (
          <div
            aria-hidden={!menuOpen}
            aria-label="Dev menu"
            className={[
              styles.menu,
              menuAbove ? styles.menuAbove : "",
              menuShown ? styles.menuShown : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onTransitionEnd={handleMenuTransitionEnd}
            role="menu"
          >
            <div className={styles.rows}>
              <div className={styles.row}>
                <p className={styles.rowTitle}>DS identifier</p>
                <button
                  aria-checked={enabled}
                  aria-label="Toggle DS identifier highlights"
                  className={[styles.switch, enabled ? styles.switchOn : ""].filter(Boolean).join(" ")}
                  onClick={() => setEnabled((current) => !current)}
                  role="switch"
                  type="button"
                >
                  <span className={styles.switchThumb} />
                </button>
              </div>
              <div className={styles.row}>
                <p className={styles.rowTitle}>Grid</p>
                <button
                  aria-checked={gridEnabled}
                  aria-label="Toggle layout grid overlay"
                  className={[styles.switch, gridEnabled ? styles.switchOn : ""].filter(Boolean).join(" ")}
                  onClick={() => setGridEnabled((current) => !current)}
                  role="switch"
                  type="button"
                >
                  <span className={styles.switchThumb} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {gridEnabled ? (
        <div aria-hidden="true" className={styles.gridOverlay}>
          <div className={styles.gridBaseline} />
          <div className={styles.gridColumns}>
            <div className={styles.gridShell}>
              <span className={styles.gridLabel}>Shell</span>
              <div className={styles.gridText}>
                <span className={styles.gridLabel}>Text</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {enabled
        ? highlights.map((box, index) => (
            <div
              aria-hidden="true"
              className={styles.highlight}
              key={`${box.name}-${index}-${Math.round(box.left)}-${Math.round(box.top)}`}
              style={{
                height: box.height,
                left: box.left,
                top: box.top,
                width: box.width
              }}
            >
              <span className={styles.label}>{box.name}</span>
            </div>
          ))
        : null}
    </>
  );
}
