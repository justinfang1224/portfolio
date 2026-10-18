import Link from "next/link";
import { dsMarker } from "@/lib/ds-marker";
import { ArrowUpRightIcon } from "./icons";
import { MotionReveal } from "./MotionReveal";
import styles from "./WritingItem.module.css";

type WritingItemProps = {
  category: string;
  date: string;
  delay?: number;
  flush?: boolean;
  href?: string;
  title: string;
};

export function WritingItem({ category, date, delay = 0, flush = false, href = "#", title }: WritingItemProps) {
  return (
    <MotionReveal
      as="article"
      className={[styles.item, flush ? styles.flush : ""].filter(Boolean).join(" ")}
      delay={delay}
      {...dsMarker("WritingItem")}
    >
      <Link className={styles.itemLink} href={href}>
        <div className={styles.itemText}>
          <h3 className={styles.itemTitle}>{title}</h3>
          <p className={styles.meta}>
            <span>{date}</span>
            <span aria-hidden="true">•</span>
            <span>{category}</span>
          </p>
        </div>
        <ArrowUpRightIcon className={styles.arrow} />
      </Link>
    </MotionReveal>
  );
}
