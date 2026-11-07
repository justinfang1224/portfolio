"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { aboutBadge } from "@/content/about";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./NameBadge.module.css";

const loadLanyard = () => import("./name-badge/Lanyard");

const Lanyard = dynamic(loadLanyard, {
  ssr: false
});

if (typeof window !== "undefined") {
  void loadLanyard();
}

const posterRows = [
  { icon: "🌐", text: aboutBadge.location },
  { icon: "🖥️", text: aboutBadge.job },
  { icon: "✉️", text: aboutBadge.email }
] as const;

export function NameBadge() {
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <div
      className={styles.slot}
      data-badge-ready={sceneReady ? "true" : "false"}
      data-badge-slot=""
      {...dsMarker("NameBadge")}
    >
      <div aria-hidden="true" className={styles.poster}>
        <span className={styles.posterStrap} />
        <article className={styles.posterCard}>
          <p className={styles.posterName}>{aboutBadge.name}</p>
          <img alt="" className={styles.posterPhoto} src={aboutBadge.photo} />
          <ul className={styles.posterRows}>
            {posterRows.map((row) => (
              <li key={row.text}>
                <span aria-hidden="true">{row.icon}</span>
                <span>{row.text}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
      <Lanyard
        email={aboutBadge.email}
        job={aboutBadge.job}
        location={aboutBadge.location}
        name={aboutBadge.name}
        onReady={() => setSceneReady(true)}
        photo={aboutBadge.photo}
      />
      <p className={styles.srOnly}>
        {aboutBadge.name}. {aboutBadge.location}. {aboutBadge.job}. {aboutBadge.email}.
        <span className={styles.dragHint}> Drag the badge to swing it.</span>
      </p>
    </div>
  );
}
