"use client";

import { Carousel } from "@/components/Carousel";
import { dsMarker } from "@/lib/ds-marker";
import styles from "./AboutCollage.module.css";

export function AboutCollage() {
  return (
    <>
      <div
        aria-label="About Justin photo collage"
        className={styles.desktopCarousel}
        {...dsMarker("AboutCollage")}
      >
        <Carousel corner={12} depth={20} layout="fan" sink={0} />
      </div>
      <div
        aria-label="About Justin photo collage"
        className={styles.mobileCarousel}
        {...dsMarker("AboutCollage")}
      >
        <Carousel corner={12} sink={0} />
      </div>
    </>
  );
}
