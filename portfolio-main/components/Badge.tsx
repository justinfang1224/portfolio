import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeSize = "s" | "l";
type BadgeStatus = "neutral" | "positive" | "warning";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  size?: BadgeSize;
  status?: BadgeStatus;
};

const sizeClass: Record<BadgeSize, string> = {
  l: styles.sizeL,
  s: styles.sizeS
};

const statusClass: Record<BadgeStatus, string> = {
  neutral: styles.neutral,
  positive: styles.positive,
  warning: styles.warning
};

export function Badge({ children, className, size = "s", status = "neutral" }: BadgeProps) {
  return (
    <span
      className={[styles.badge, sizeClass[size], statusClass[status], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
