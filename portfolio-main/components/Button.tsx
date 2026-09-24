import Link from "next/link";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./Button.module.css";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonSize = "m" | "s" | "icon";
type ButtonVariant = "secondary" | "text";

type ButtonProps = {
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
    size === "s" ? styles.sizeS : undefined,
    size === "icon" ? styles.icon : undefined
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
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

  if (!href) {
    return (
      <button
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        aria-label={ariaLabel}
        className={className}
        onClick={onClick}
        type="button"
        {...marker}
      >
        {children}
      </button>
    );
  }

  if (!openInNewTab && isInternalHref(href)) {
    return (
      <Link className={className} href={href} {...marker}>
        {children}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      target={openInNewTab ? "_blank" : undefined}
      {...marker}
    >
      {children}
    </a>
  );
}
