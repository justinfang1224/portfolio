import styles from "./Tag.module.css";
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  variant?: "default" | "contrast";
};

export function Tag({ children, variant = "default" }: TagProps) {
  const className = [styles.tag, variant === "contrast" ? styles.contrast : ""]
    .filter(Boolean)
    .join(" ");

  return <span className={className}>{children}</span>;
}
