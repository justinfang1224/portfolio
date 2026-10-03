"use client";

import Link from "next/link";
import { dsMarker } from "@/lib/ds-marker";
import { playButtonSound } from "./buttonSound";
import styles from "./Button.module.css";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonSize = "m" | "s" | "icon";
type ButtonVariant = "secondary" | "text" | "outline";

type ButtonProps = {
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean | "dialog" | "menu" | "listbox" | "tree" | "grid";
  "aria-label"?: string;
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  openInNewTab?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

function buttonClassName(size: ButtonSize, variant: ButtonVariant) {
  return [
    styles.button,
    variant === "text" ? styles.text : undefined,
    variant === "outline" ? styles.outline : undefined,
    size === "s" ? styles.sizeS : undefined,
    size === "icon" ? styles.icon : undefined
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHasPopup,
  "aria-label": ariaLabel,
  children,
  href,
  onClick,
  openInNewTab = false,
  size = "m",
  variant = "secondary"
}: ButtonProps) {
  const className = buttonClassName(size, variant);
  const marker = dsMarker("Button");
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    playButtonSound();
    onClick?.(event);
  };

  if (!href) {
    return (
      <button
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        aria-label={ariaLabel}
        className={className}
        onClick={handleClick}
        type="button"
        {...marker}
      >
        {children}
      </button>
    );
  }

  if (!openInNewTab && isInternalHref(href)) {
    return (
      <Link className={className} href={href} onClick={() => playButtonSound()} {...marker}>
        {children}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      onClick={() => playButtonSound()}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      target={openInNewTab ? "_blank" : undefined}
      {...marker}
    >
      {children}
    </a>
  );
}
