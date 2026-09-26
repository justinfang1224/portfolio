"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode
} from "react";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./TermExplain.module.css";

type TermExplainProps = {
  children: ReactNode;
  className?: string;
  explanation: string;
  /** Wrap an interactive child (e.g. a link). Hover and focus-within trigger the panel. */
  asChild?: boolean;
};

type DescribedChildProps = {
  "aria-describedby"?: string;
};

export function TermExplain({
  asChild = false,
  children,
  className,
  explanation
}: TermExplainProps) {
  const tooltipId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const panel = rootRef.current?.querySelector<HTMLElement>("[role='tooltip']");

    if (!panel) {
      return;
    }

    const clampPanel = () => {
      const root = panel.parentElement;

      if (!root) {
        return;
      }

      const margin = 12;
      const viewWidth = document.documentElement.clientWidth;
      const rootBounds = root.getBoundingClientRect();
      const center = rootBounds.left + rootBounds.width / 2;
      const width = panel.offsetWidth;
      let left = center - width / 2;

      if (left < margin) {
        left = margin;
      }

      if (left + width > viewWidth - margin) {
        left = Math.max(margin, viewWidth - margin - width);
      }

      panel.style.setProperty("--term-explain-shift", `${left - (center - width / 2)}px`);
    };

    clampPanel();
    window.addEventListener("resize", clampPanel);

    return () => window.removeEventListener("resize", clampPanel);
  }, [explanation]);

  const content =
    asChild && isValidElement<DescribedChildProps>(children)
      ? cloneElement(children as ReactElement<DescribedChildProps>, {
          "aria-describedby": [children.props["aria-describedby"], tooltipId]
            .filter(Boolean)
            .join(" ")
        })
      : asChild
        ? children
        : (
            <span className={styles.term}>{children}</span>
          );

  return (
    <span
      ref={rootRef}
      aria-describedby={asChild ? undefined : tooltipId}
      className={[styles.root, asChild ? styles.asChild : "", className].filter(Boolean).join(" ")}
      tabIndex={asChild ? undefined : 0}
      {...dsMarker("TermExplain")}
    >
      {content}
      <span className={styles.panel} id={tooltipId} role="tooltip">
        {explanation}
      </span>
    </span>
  );
}
