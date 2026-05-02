"use client";

import {
  createElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

type RevealTag = "article" | "div" | "footer" | "section";

type MotionRevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  children: ReactNode;
  delay?: number;
  rootMargin?: string;
  threshold?: number;
};

function isElementInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= viewportHeight && rect.left <= viewportWidth;
}

export function MotionReveal({
  as = "div",
  children,
  className,
  delay = 0,
  rootMargin = "0px 0px -10% 0px",
  style,
  threshold = 0.12,
  ...props
}: MotionRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || isVisible) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      setIsVisible(true);
      return;
    }

    if (isElementInViewport(node)) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, rootMargin, threshold]);

  const revealStyle = {
    ...style,
    "--reveal-delay": `${delay}ms`
  } as CSSProperties;

  return createElement(
    as,
    {
      ...props,
      ref,
      className: ["motion-reveal", isVisible ? "motion-reveal--visible" : "", className]
        .filter(Boolean)
        .join(" "),
      style: revealStyle
    },
    children
  );
}
