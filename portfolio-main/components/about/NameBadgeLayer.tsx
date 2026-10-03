"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { aboutBadge } from "@/content/about";
import { useBadgePresence } from "./badgePresence";
import styles from "./NameBadge.module.css";

const NameBadgeScene = dynamic(() => import("./name-badge/NameBadgeScene"), {
  ssr: false
});

/**
 * The WebGL badge stays mounted for the whole visit. It warms up behind the
 * splash, pauses once the card is at rest, and is shown only after a frame
 * has been drawn into the profile slot.
 */
export function NameBadgeLayer() {
  const pathname = usePathname();
  const onAbout = pathname === "/about";
  const { ready, setReady } = useBadgePresence();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      aria-hidden="true"
      className={styles.stage}
      data-show={onAbout && ready ? "true" : "false"}
    >
      <NameBadgeScene
        email={aboutBadge.email}
        frameloop={onAbout || !loaded ? "always" : "never"}
        job={aboutBadge.job}
        location={aboutBadge.location}
        name={aboutBadge.name}
        onLoaded={() => setLoaded(true)}
        onReady={() => setReady(true)}
        photo={aboutBadge.photo}
      />
    </div>
  );
}
