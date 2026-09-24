"use client";

import {
  cloneElement,
  isValidElement,
  useId,
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
