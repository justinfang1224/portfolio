"use client";

import { useEffect, useState } from "react";
import styles from "./Footer.module.css";

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

export function Footer() {
  const [hongKongTime, setHongKongTime] = useState(() => getHongKongTime());

  useEffect(() => {
    setHongKongTime(getHongKongTime());

    const timer = window.setInterval(() => {
      setHongKongTime(getHongKongTime());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>© 2026  •  Jenhung.work@gmail.com</p>
      <p className={styles.location}>
        {"Hong Kong  [ GMT+8 ]  •  "}
        <time className={styles.time} dateTime={hongKongTime} suppressHydrationWarning>
          {hongKongTime}
        </time>
      </p>
    </footer>
  );
}
