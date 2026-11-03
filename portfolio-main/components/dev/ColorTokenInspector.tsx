"use client";

import { useEffect, useRef, useState } from "react";
import { COLOR_SCHEME_EVENT } from "@/lib/color-scheme";
import {
  elementLabel,
  elementStack,
  inspectElement,
  type ColorTokenRow
} from "./colorTokenInspect";
import styles from "./ColorTokenInspector.module.css";

type ColorTokenInspectorProps = {
  enabled: boolean;
};

function isInspectorUi(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("[data-ds-audit-root], [data-color-inspect-ui]"));
}

function pickElement(x: number, y: number) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (element.closest("[data-ds-audit-root], [data-color-inspect-ui]")) {
      continue;
    }
    return element;
  }
  return null;
}

export function ColorTokenInspector({ enabled }: ColorTokenInspectorProps) {
  const [target, setTarget] = useState<Element | null>(null);
  const [pinned, setPinned] = useState(false);
  const [rows, setRows] = useState<ColorTokenRow[]>([]);
  const [frame, setFrame] = useState<{ height: number; left: number; top: number; width: number } | null>(null);
  const pinnedRef = useRef(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    if (!enabled) {
      setPinned(false);
      setTarget(null);
      setRows([]);
      setFrame(null);
      document.documentElement.removeAttribute("data-color-inspect");
      return;
    }

    document.documentElement.setAttribute("data-color-inspect", "on");
    const cursorStyle = document.createElement("style");
    cursorStyle.textContent =
      'html[data-color-inspect="on"], html[data-color-inspect="on"] * { cursor: crosshair !important; }';
    document.head.appendChild(cursorStyle);

    const refresh = (element: Element | null) => {
      if (!element || !element.isConnected) {
        setRows([]);
        setFrame(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      setFrame({
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width
      });
      setRows(inspectElement(element));
    };

    const onMove = (event: PointerEvent) => {
      if (pinnedRef.current) {
        refresh(targetRef.current);
        return;
      }

      if (isInspectorUi(event.target)) {
        return;
      }

      const next = pickElement(event.clientX, event.clientY);
      targetRef.current = next;
      setTarget(next);
      refresh(next);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (isInspectorUi(event.target)) {
        return;
      }

      const next = pickElement(event.clientX, event.clientY);
      if (!next) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (pinnedRef.current && targetRef.current === next) {
        pinnedRef.current = false;
        setPinned(false);
        return;
      }

      pinnedRef.current = true;
      targetRef.current = next;
      setPinned(true);
      setTarget(next);
      refresh(next);
    };

    const onClick = (event: MouseEvent) => {
      if (isInspectorUi(event.target)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !pinnedRef.current) {
        return;
      }
      pinnedRef.current = false;
      setPinned(false);
    };

    const onScroll = () => refresh(targetRef.current);

    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    window.addEventListener("transitionend", onScroll, true);
    window.addEventListener(COLOR_SCHEME_EVENT, onScroll);

    return () => {
      document.documentElement.removeAttribute("data-color-inspect");
      cursorStyle.remove();
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("transitionend", onScroll, true);
      window.removeEventListener(COLOR_SCHEME_EVENT, onScroll);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const stack = target ? elementStack(target) : [];

  return (
    <>
      {frame ? (
        <div
          aria-hidden="true"
          className={styles.frame}
          style={{ height: frame.height, left: frame.left, top: frame.top, width: frame.width }}
        />
      ) : null}
      <aside aria-label="Color tokens" className={styles.panel} data-color-inspect-ui>
        <div className={styles.header}>
          <div>
            <p className={styles.title}>{pinned ? "Color tokens · pinned" : "Color tokens"}</p>
            <p className={styles.target}>{target ? elementLabel(target) : "Hover any part of the page"}</p>
          </div>
          {pinned ? (
            <button
              className={styles.unpin}
              onClick={() => {
                pinnedRef.current = false;
                setPinned(false);
              }}
              type="button"
            >
              Unpin
            </button>
          ) : null}
        </div>

        {stack.length > 1 ? (
          <div className={styles.stack}>
            {stack.map((element, index) => (
              <button
                className={[styles.chip, element === target ? styles.chipActive : ""].filter(Boolean).join(" ")}
                key={`${elementLabel(element)}-${index}`}
                onClick={() => {
                  pinnedRef.current = true;
                  targetRef.current = element;
                  setPinned(true);
                  setTarget(element);
                  const rect = element.getBoundingClientRect();
                  setFrame({ height: rect.height, left: rect.left, top: rect.top, width: rect.width });
                  setRows(inspectElement(element));
                }}
                title={elementLabel(element)}
                type="button"
              >
                {elementLabel(element)}
              </button>
            ))}
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className={styles.rows}>
            {rows.map((row, index) => (
              <div className={styles.row} key={`${row.label}-${row.chain}-${index}`}>
                <span className={styles.swatch} style={{ background: row.swatch }} />
                <div>
                  <p className={styles.rowLabel}>
                    {row.label}
                    {row.inherited ? " · inherited" : ""}
                  </p>
                  <p className={styles.chain}>{row.chain}</p>
                  {row.detail ? <p className={styles.detail}>{row.detail}</p> : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{target ? "No color token on this part." : "Background, border, and text tokens show up here."}</p>
        )}
        <p className={styles.hint}>Hover to inspect. Click to pin. Click again to unpin.</p>
      </aside>
    </>
  );
}
