"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RollingMetricValueProps = {
  value: string;
};

type ParsedMetricValue = {
  decimals: number;
  numericValue: number;
  prefix: string;
  suffix: string;
};

const ROLL_DURATION_MS = 900;

function parseMetricValue(value: string): ParsedMetricValue | null {
  const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  const [, prefix, numericText, suffix] = match;
  const decimals = numericText.includes(".") ? numericText.split(".")[1]?.length ?? 0 : 0;
  const numericValue = Number(numericText);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return {
    decimals,
    numericValue,
    prefix,
    suffix
  };
}

function formatMetricValue(parsedValue: ParsedMetricValue, progressValue: number) {
  return `${parsedValue.prefix}${progressValue.toFixed(parsedValue.decimals)}${parsedValue.suffix}`;
}

export function RollingMetricValue({ value }: RollingMetricValueProps) {
  const parsedValue = useMemo(() => parseMetricValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(() =>
    parsedValue ? formatMetricValue(parsedValue, 0) : value
  );
  const valueRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!parsedValue) {
      setDisplayValue(value);
      return;
    }

    setDisplayValue(formatMetricValue(parsedValue, 0));

    const element = valueRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!element || prefersReducedMotion.matches) {
      setDisplayValue(value);
      return;
    }

    let animationFrame = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (startTime === 0) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / ROLL_DURATION_MS, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = parsedValue.numericValue * easedProgress;

      setDisplayValue(formatMetricValue(parsedValue, nextValue));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        animationFrame = window.requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [parsedValue, value]);

  return <strong ref={valueRef}>{displayValue}</strong>;
}
