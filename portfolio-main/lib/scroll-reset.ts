import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Jump to the top before the next paint so a short page cannot show its footer. */
export function scrollToTopImmediate() {
  if (typeof window === "undefined") {
    return;
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const root = document.documentElement;
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  lenis?.scrollTo(0, { immediate: true, force: true });
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}
