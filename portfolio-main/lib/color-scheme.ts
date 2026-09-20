export const COLOR_SCHEME_STORAGE_KEY = "portfolio-color-scheme";

export const colorSchemePreferences = ["light", "dark", "system"] as const;

export type ColorSchemePreference = (typeof colorSchemePreferences)[number];
export type ResolvedColorScheme = "light" | "dark";

export const colorSchemeScript = `(function(){try{var p=localStorage.getItem("${COLOR_SCHEME_STORAGE_KEY}");if(p==="light"||p==="dark"){document.documentElement.setAttribute("data-theme",p);document.documentElement.setAttribute("data-theme-preference",p);}else{document.documentElement.setAttribute("data-theme-preference","system");}}catch(e){document.documentElement.setAttribute("data-theme-preference","system");}})();`;

export function isColorSchemePreference(value: string | null): value is ColorSchemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readStoredColorScheme(): ColorSchemePreference {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    return isColorSchemePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function getSystemColorScheme(): ResolvedColorScheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveColorScheme(preference: ColorSchemePreference): ResolvedColorScheme {
  return preference === "system" ? getSystemColorScheme() : preference;
}

export const THEME_TRANSITION_MS = 420;

let themeTransitionTimer: number | undefined;

export function applyColorScheme(preference: ColorSchemePreference) {
  const root = document.documentElement;
  root.setAttribute("data-theme-preference", preference);

  if (preference === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", preference);
  }

  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, preference);
  } catch {
    // Private browsing can block storage. The attribute still applies for this visit.
  }
}

export function applyColorSchemeWithTransition(preference: ColorSchemePreference) {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    applyColorScheme(preference);
    return;
  }

  root.setAttribute("data-theme-transitioning", "");
  applyColorScheme(preference);

  window.clearTimeout(themeTransitionTimer);
  themeTransitionTimer = window.setTimeout(() => {
    root.removeAttribute("data-theme-transitioning");
    themeTransitionTimer = undefined;
  }, THEME_TRANSITION_MS);
}
