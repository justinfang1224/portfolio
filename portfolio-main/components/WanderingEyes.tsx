import type { CSSProperties, ComponentProps } from "react";
import styles from "./WanderingEyes.module.css";

type WanderingEyesProps = ComponentProps<"span"> & {
  blinkScale?: number;
  eyeScale?: number;
  gapScale?: number;
  pupilScale?: number;
  travelScale?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function WanderingEyes({
  blinkScale = 0.375,
  className,
  eyeScale = 0.62,
  gapScale = 0.09,
  pupilScale = 0.32,
  style,
  travelScale = 0.3125,
  ...props
}: WanderingEyesProps) {
  const eyesStyle = {
    ...style,
    "--wandering-eyes-eye": `${(clamp(eyeScale, 0.28, 0.7) * 100).toFixed(2)}cqmin`,
    "--wandering-eyes-gap": `${(clamp(gapScale, 0.04, 0.3) * 100).toFixed(2)}cqmin`,
    "--wandering-eyes-pupil-scale": `${clamp(pupilScale, 0.12, 0.45)}`,
    "--wandering-eyes-blink": `${clamp(blinkScale, 0.15, 1)}`,
    "--wandering-eyes-travel-scale": `${clamp(travelScale, 0.08, 0.5)}`
  } as CSSProperties;

  return (
    <span
      className={[styles.eyes, className].filter(Boolean).join(" ")}
      role="status"
      style={eyesStyle}
      {...props}
    >
      <span aria-hidden="true" className={styles.pair}>
        {Array.from({ length: 2 }, (_, index) => (
          <span className={styles.eye} key={index}>
            <span className={styles.clip}>
              <span className={styles.pupil} />
            </span>
          </span>
        ))}
      </span>
      <span className={styles.srOnly}>Loading</span>
    </span>
  );
}
