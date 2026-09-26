"use client";

/**
 * Ported from Bencho GlassIconBar (MIT — bencho.dev/licence).
 * Source: github.com/lorenzo04us/Bencho → src/lab/GlassNavs.tsx
 * Colors remapped to this project's design-system tokens.
 */

import Link from "next/link";
import {
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  type SVGProps
} from "react";
import styles from "./IconBar.module.css";

export type IconBarItem = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number | string }>;
};

export type IconBarProps = {
  items: readonly IconBarItem[];
  activeId: string;
  /** Corner radius — 0 to 26px */
  corner?: number;
  /** How far the pill stretches in transit — 0 to 100 */
  dilate?: number;
  /** How hard it lands — 0 to 100 */
  bounce?: number;
  /** Animation speed — 0 to 100 */
  speed?: number;
  axis?: "row" | "column";
  "aria-label"?: string;
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
  onItemFocus?: (id: string) => void;
  onItemPointerEnter?: (id: string) => void;
  trailing?: ReactNode;
};

const GLYPH_SIZE = 20;

export function IconBar({
  items,
  activeId,
  axis = "row",
  "aria-label": ariaLabel = "Primary navigation",
  onItemClick,
  onItemFocus,
  onItemPointerEnter,
  trailing
}: IconBarProps) {
  const vertical = axis === "column";

  return (
    <nav
      aria-label={ariaLabel}
      className={styles.nav}
      data-orientation={vertical ? "vertical" : "horizontal"}
    >
      {items.map(({ id, label, href, icon: Icon }) => {
        const isActive = activeId === id;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            className={styles.item}
            data-active={isActive}
            href={href}
            key={id}
            onClick={(event) => onItemClick?.(event, id)}
            onFocus={onItemFocus ? () => onItemFocus(id) : undefined}
            onPointerEnter={onItemPointerEnter ? () => onItemPointerEnter(id) : undefined}
          >
            <Icon
              aria-hidden="true"
              className={styles.icon}
              height={GLYPH_SIZE}
              strokeWidth={2}
              width={GLYPH_SIZE}
            />
          </Link>
        );
      })}
      {trailing ? (
        <>
          <span aria-hidden="true" className={styles.divider} />
          {trailing}
        </>
      ) : null}
    </nav>
  );
}
