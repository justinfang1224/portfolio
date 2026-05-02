import Link from "next/link";
import styles from "./Button.module.css";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  openInNewTab?: boolean;
};

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function Button({ children, href, openInNewTab = false }: ButtonProps) {
  if (!href) {
    return (
      <button className={styles.button} type="button">
        {children}
      </button>
    );
  }

  if (!openInNewTab && isInternalHref(href)) {
    return (
      <Link className={styles.button} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <a
      className={styles.button}
      href={href}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      target={openInNewTab ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}
