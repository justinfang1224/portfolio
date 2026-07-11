"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";

const avatars = {
  current: "/images/profile/home-avatar.png",
  figma: "/images/profile/figma-avatar.png"
};

export function ProfileAvatarToggle() {
  const [isFigmaAvatar, setIsFigmaAvatar] = useState(false);

  return (
    <button
      aria-label="Switch profile picture"
      aria-pressed={isFigmaAvatar}
      className={styles.avatarButton}
      onClick={() => setIsFigmaAvatar((currentValue) => !currentValue)}
      type="button"
    >
      <Image
        alt=""
        className={styles.avatar}
        height={64}
        priority
        sizes="64px"
        src={isFigmaAvatar ? avatars.figma : avatars.current}
        width={64}
      />
    </button>
  );
}
