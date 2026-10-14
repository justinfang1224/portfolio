"use client";

import dynamic from "next/dynamic";
import { aboutBadge } from "@/content/about";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./NameBadge.module.css";

const Lanyard = dynamic(() => import("./name-badge/Lanyard"), {
  ssr: false
});

export function NameBadge() {
  return (
    <div className={styles.slot} data-badge-slot="" {...dsMarker("NameBadge")}>
      <Lanyard
        email={aboutBadge.email}
        job={aboutBadge.job}
        location={aboutBadge.location}
        name={aboutBadge.name}
        photo={aboutBadge.photo}
      />
      <p className={styles.srOnly}>
        {aboutBadge.name}. {aboutBadge.location}. {aboutBadge.job}. {aboutBadge.email}.
        <span className={styles.dragHint}> Drag the badge to swing it.</span>
      </p>
    </div>
  );
}
