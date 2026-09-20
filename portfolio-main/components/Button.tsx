import Link from "next/link";
import styles from "./Button.module.css";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonSize = "m" | "s";
type ButtonVariant = "secondary" | "text";

type ButtonProps = {
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
    size === "s" ? styles.sizeS : undefined
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  "aria-label": ariaLabel,
  children,
  href,
  onClick,
  openInNewTab = false,
  size = "m",
  variant = "secondary"
}: ButtonProps) {
  const className = buttonClassName(size, variant);

  if (!href) {
    return (
      <button aria-label={ariaLabel} className={className} onClick={onClick} type="button">
        {children}
      </button>
    );
  }

  if (!openInNewTab && isInternalHref(href)) {
    return (
      <Link className={className} href={href}>
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
    >
      {children}
    </a>
  );
}
