"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent
} from "react";
import { Button } from "@/components/Button";
import { SettingsIcon } from "@/components/icons";
import styles from "./DesignSystemAudit.module.css";

const STORAGE_KEY = "portfolio-ds-audit";
const DRAG_THRESHOLD_PX = 4;
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
  x: number | null;
  y: number | null;
};

function readStoredState(): StoredState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { enabled: false, x: null, y: null };
    }

    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      enabled: Boolean(parsed.enabled),
      x: typeof parsed.x === "number" ? parsed.x : null,
      y: typeof parsed.y === "number" ? parsed.y : null
    };
  } catch {
    return { enabled: false, x: null, y: null };
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const [menuAbove, setMenuAbove] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [highlights, setHighlights] = useState<HighlightBox[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const dragRef = useRef<{
    moved: boolean;
    offsetX: number;
    offsetY: number;
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);
  const menuShownRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const clampPosition = useCallback((x: number, y: number) => {
    const trigger = triggerRef.current;
    const width = trigger?.offsetWidth ?? 34;
    const height = trigger?.offsetHeight ?? 36;
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);

    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY)
    };
  }, []);

  useEffect(() => {
    const stored = readStoredState();
    setEnabled(stored.enabled);
    if (stored.x !== null && stored.y !== null) {
      setPosition(clampPosition(stored.x, stored.y));
    }
    setHydrated(true);
  }, [clampPosition]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => {
        if (!current) {
          return current;
        }
        return clampPosition(current.x, current.y);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampPosition]);

  useEffect(() => {
    if (!hydrated || dragging) {
      return;
    }

    writeStoredState({
      enabled,
      x: position?.x ?? null,
      y: position?.y ?? null
    });
  }, [dragging, enabled, hydrated, position]);

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

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const handle = event.currentTarget;
    const rect = handle.getBoundingClientRect();

    dragRef.current = {
      moved: false,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY
    };

    if (handle.setPointerCapture) {
      handle.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (!drag.moved && distance < DRAG_THRESHOLD_PX) {
      return;
    }

    drag.moved = true;
    setDragging(true);
    setMenuOpen(false);
    // Allow overshoot while dragging; bounce back on release.
    setPosition({
      x: event.clientX - drag.offsetX,
      y: event.clientY - drag.offsetY
    });
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!drag.moved) {
      setDragging(false);
      setMenuOpen((current) => !current);
      return;
    }

    // Enable settle transition first, then clamp on the next frame so it bounces back.
    setDragging(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPosition((current) => {
          if (!current) {
            return current;
          }
          return clampPosition(current.x, current.y);
        });
      });
    });
  };

  const handleTriggerClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    // Pointer open/close is handled on pointerup. A captured pointer never
    // delivers click to this button; keyboard activation still does (detail 0).
    if (event.detail > 0) {
      return;
    }

    setMenuOpen((current) => !current);
  };

  if (!hydrated) {
    return null;
  }

  const rootStyle: CSSProperties | undefined = position
    ? { left: position.x, top: position.y, right: "auto" }
    : undefined;

  return (
    <>
      <div
        className={[styles.root, dragging ? styles.rootDragging : styles.rootSettling]
          .filter(Boolean)
          .join(" ")}
        data-ds-audit-root
        ref={rootRef}
        style={rootStyle}
      >
        <div
          className={styles.trigger}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={triggerRef}
        >
          <Button
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label="Dev menu"
            onClick={handleTriggerClick}
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
          </div>
        ) : null}
      </div>

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
