/**
 * Apple browser chrome adapted from BrowserMockupCard (Opensource UI).
 * https://opensourceui.in/components/browser
 * The source component is MIT licensed. This version uses portfolio design
 * tokens because the site does not load Tailwind CSS.
 */

import type { ReactNode } from "react";
import styles from "./BrowserMockupCard.module.css";

type BrowserMockupCardProps = {
  children?: ReactNode;
  className?: string;
};

export function BrowserMockupCard({ children, className }: BrowserMockupCardProps) {
  return (
    <div className={[styles.shell, className].filter(Boolean).join(" ")} data-slot="browser-mockup-card">
      <div className={styles.chrome}>
        <div aria-hidden="true" className={styles.lights}>
          <span className={[styles.light, styles.close].join(" ")} />
          <span className={[styles.light, styles.minimize].join(" ")} />
          <span className={[styles.light, styles.zoom].join(" ")} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.stage}>{children}</div>
      </div>
    </div>
  );
}
