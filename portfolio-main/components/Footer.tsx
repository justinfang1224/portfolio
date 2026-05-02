"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/portfolio";
import styles from "./Footer.module.css";
import { MotionReveal } from "./MotionReveal";

const socialLinks = [
  {
    href: "https://www.instagram.com/justinfang1224",
    label: "Instagram"
  },
  {
    href: "https://www.linkedin.com/in/justinfang-1224",
    label: "Linkedin"
  },
  {
    href: "https://x.com/justinfang1224",
    label: "X"
  }
] as const;

const catFrames = [
  ["^. _ .^", "( > < )"],
  ["^. _ .v", "( > < )"]
] as const;

const hongKongTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Hong_Kong"
});

function getHongKongTime() {
  return hongKongTimeFormatter.format(new Date());
}

type FooterProps = {
  width?: "shell" | "text" | "content";
};

export function Footer({ width = "shell" }: FooterProps) {
  const [catFrameIndex, setCatFrameIndex] = useState(0);
  const [hongKongTime, setHongKongTime] = useState("");
  const catFrame = catFrames[catFrameIndex];
  const widthClassName =
    width === "content" ? styles.contentWidth : width === "text" ? styles.textWidth : "";
  const footerClassName = widthClassName ? `${styles.footer} ${widthClassName}` : styles.footer;

  useEffect(() => {
    setHongKongTime(getHongKongTime());

    const timer = window.setInterval(() => {
      setHongKongTime(getHongKongTime());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let currentFrameIndex = 0;
    let timer: number;

    const scheduleNextFrame = () => {
      const frameDuration = currentFrameIndex === 0 ? 3000 : 300;

      timer = window.setTimeout(() => {
        currentFrameIndex = (currentFrameIndex + 1) % catFrames.length;
        setCatFrameIndex(currentFrameIndex);
        scheduleNextFrame();
      }, frameDuration);
    };

    scheduleNextFrame();

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <MotionReveal as="footer" className={footerClassName}>
      <div className={styles.identity}>
        <div aria-hidden="true" className={styles.catMark}>
          <p>{catFrame[0]}</p>
          <p>{catFrame[1]}</p>
        </div>
        <p className={styles.copyright}>© 2026&nbsp;&nbsp;•&nbsp;&nbsp;Jenhung.work@gmail.com</p>
      </div>

      <div className={styles.groups}>
        <section aria-labelledby="footer-socials" className={styles.group}>
          <h2 id="footer-socials">Socials</h2>
          <ul className={styles.linkList}>
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-location" className={styles.group}>
          <h2 id="footer-location">Location</h2>
          <div className={styles.locationList}>
            <p>Asia</p>
            <p>{profile.footer.location}</p>
            <p>
              {profile.footer.timezone}
              {hongKongTime ? (
                <>
                  {" • "}
                  <time className={styles.time} dateTime={hongKongTime}>
                    {hongKongTime}
                  </time>
                </>
              ) : null}
            </p>
          </div>
        </section>
      </div>
    </MotionReveal>
  );
}
