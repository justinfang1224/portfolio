import styles from "./Tag.module.css";
import { dsMarker } from "@/lib/ds-marker";
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  variant?: "default" | "contrast";
};

export function Tag({ children, variant = "default" }: TagProps) {
  const className = [styles.tag, variant === "contrast" ? styles.contrast : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} {...dsMarker("Tag")}>
      {children}
    </span>
  );
}
