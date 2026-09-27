"use client";

import {
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useRef
} from "react";

const MAX_TILT = 14;

type CardTiltProps = {
  children: ReactNode;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CardTilt({ children }: CardTiltProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    const card = tiltRef.current?.querySelector<HTMLElement>(".t-tilt-card");

    if (!card) {
      return;
    }

    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
  };

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) {
      return;
    }

    const tilt = tiltRef.current;
    const card = tilt?.querySelector<HTMLElement>(".t-tilt-card");

    if (!tilt || !card) {
      return;
    }

    const rect = tilt.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-ry", `${((px - 0.5) * MAX_TILT).toFixed(2)}deg`);
    card.style.setProperty("--tilt-rx", `${((0.5 - py) * MAX_TILT).toFixed(2)}deg`);
  };

  const child = isValidElement(children) ? (children as ReactElement<{ className?: string }>) : null;

  return (
    <div
      className="t-tilt"
      onPointerCancel={reset}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          reset();
        }
      }}
      onPointerMove={track}
      ref={tiltRef}
    >
      {child
        ? cloneElement(child, {
            className: [child.props.className, "t-tilt-card"].filter(Boolean).join(" ")
          })
        : children}
    </div>
  );
}
