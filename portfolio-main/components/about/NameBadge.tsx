"use client";

import { aboutBadge } from "@/content/about";
import { dsMarker } from "@/lib/ds-marker";
import { useBadgePresence } from "./badgePresence";
import styles from "./NameBadge.module.css";

export function NameBadge() {
  const { ready } = useBadgePresence();

  return (
    <div className={styles.slot} {...dsMarker("NameBadge")}>
      <div aria-hidden="true" className={styles.poster} hidden={ready}>
        <span className={styles.strap} />
        <article className={styles.card}>
          <div className={styles.identity}>
            <p className={styles.name}>{aboutBadge.name}</p>
            <img alt="" className={styles.photo} src={aboutBadge.photo} />
          </div>
          <ul className={styles.rows}>
            <li>
              <span aria-hidden="true">🌐</span>
              {aboutBadge.location}
            </li>
            <li>
              <span aria-hidden="true">🖥️</span>
              {aboutBadge.job}
            </li>
            <li>
              <span aria-hidden="true">✉️</span>
              {aboutBadge.email}
            </li>
          </ul>
        </article>
      </div>
      <p className={styles.srOnly}>
        {aboutBadge.name}. {aboutBadge.location}. {aboutBadge.job}. {aboutBadge.email}. Drag the
        badge to swing it.
      </p>
    </div>
  );
}
