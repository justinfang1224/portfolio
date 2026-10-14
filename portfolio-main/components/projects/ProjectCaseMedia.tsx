import { dsMarker } from "@/lib/ds-marker";
import styles from "./ProjectCaseMedia.module.css";
import type { ReactNode } from "react";

export type ProjectCaseMediaFrame =
  | "standard"
  | "video"
  | "filterAnalysis"
  | "portalAnalysis"
  | "earlyDrafts"
  | "flowchart"
  | "userTesting"
  | "filterStatusMap"
  | "finalPrototype";

type ProjectCaseMediaProps = {
  children: ReactNode;
  className?: string;
  layout?: "stack" | "row";
};

type ProjectCaseMediaItemProps = {
  alt?: string;
  caption?: string;
  children?: ReactNode;
  frame?: ProjectCaseMediaFrame;
  src?: string;
};

export function ProjectCaseMedia({ children, className, layout = "stack" }: ProjectCaseMediaProps) {
  return (
    <figure
      className={[styles.media, layout === "row" ? styles.row : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </figure>
  );
}

export function ProjectCaseMediaItem({
  alt = "",
  caption,
  children,
  frame = "standard",
  src
}: ProjectCaseMediaItemProps) {
  return (
    <div className={styles.item} {...dsMarker("ProjectCaseMedia")}>
      <div className={[styles.frame, styles[frame]].filter(Boolean).join(" ")}>
        {children ?? <img alt={alt} className={styles.image} src={src} />}
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </div>
  );
}
