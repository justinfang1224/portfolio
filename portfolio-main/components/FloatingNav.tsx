"use client";

import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import { aboutCollageImages } from "@/content/about";
import {
  applyColorSchemeWithTransition,
  COLOR_SCHEME_EVENT,
  readStoredColorScheme,
  resolveColorScheme,
  type ResolvedColorScheme
} from "@/lib/color-scheme";
import { dsMarker } from "@/lib/ds-marker";
import { IconBar } from "./IconBar";
import { AboutIcon, HomeIcon, MoonIcon, SunIcon, WorkIcon, WritingIcon } from "./icons";
import styles from "./FloatingNav.module.css";

const navItems = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "projects", label: "Projects", href: "/projects", icon: WorkIcon },
  { id: "writings", label: "Writings", href: "/writings", icon: WritingIcon },
  { id: "about", label: "About", href: "/about", icon: AboutIcon }
] as const;

type NavItemId = (typeof navItems)[number]["id"];

let hasPreloadedAboutHero = false;

function preloadAboutHeroImages() {
  if (hasPreloadedAboutHero || typeof window === "undefined") {
    return;
  }

  hasPreloadedAboutHero = true;

  aboutCollageImages.forEach(({ src }) => {
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;
  });
}

function getActiveItemFromLocation(pathname: string): NavItemId {
  if (pathname === "/about") {
    return "about";
  }

  if (pathname.startsWith("/projects")) {
    return "projects";
  }

  if (pathname.startsWith("/writings")) {
    return "writings";
  }

  if (typeof window !== "undefined") {
    const hash = window.location.hash.replace("#", "");

    if (hash === "projects" || hash === "writings") {
      return hash;
    }
  }

  return "home";
}

export function FloatingNav() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<NavItemId>(() =>
    getActiveItemFromLocation(pathname)
  );
  const [colorScheme, setColorScheme] = useState<ResolvedColorScheme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return resolveColorScheme(readStoredColorScheme());
  });
  const nextScheme: ResolvedColorScheme = colorScheme === "dark" ? "light" : "dark";

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setActiveItem(id as NavItemId);

    if (id !== "home" || pathname !== "/") {
      return;
    }

    event.preventDefault();
    window.history.replaceState(null, "", "/");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth"
    });
  };

  useEffect(() => {
    const updateActiveItem = () => {
      setActiveItem(getActiveItemFromLocation(pathname));
    };

    // Defer pathname sync to the next frame so hash-based routes
    // (e.g. "/#projects") can settle before deriving active state.
    const frameId = window.requestAnimationFrame(updateActiveItem);
    window.addEventListener("hashchange", updateActiveItem);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("hashchange", updateActiveItem);
    };
  }, [pathname]);

  useEffect(() => {
    const syncColorScheme = () => {
      setColorScheme(resolveColorScheme(readStoredColorScheme()));
    };

    syncColorScheme();
    window.addEventListener(COLOR_SCHEME_EVENT, syncColorScheme);

    return () => {
      window.removeEventListener(COLOR_SCHEME_EVENT, syncColorScheme);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/about") {
      return;
    }

    const preload = () => preloadAboutHeroImages();
    const supportsIdleCallback = "requestIdleCallback" in window;
    const idleCallbackId = supportsIdleCallback
      ? window.requestIdleCallback(preload, { timeout: 2500 })
      : undefined;
    const timeoutId = supportsIdleCallback ? undefined : window.setTimeout(preload, 1200);

    return () => {
      if (idleCallbackId !== undefined) {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  return (
    <header className={styles.header} {...dsMarker("FloatingNav")}>
      <IconBar
        activeId={activeItem}
        aria-label="Primary navigation"
        axis="row"
        bounce={40}
        corner={26}
        dilate={60}
        items={navItems}
        onItemClick={handleNavClick}
        onItemFocus={(id) => {
          if (id === "about") {
            preloadAboutHeroImages();
          }
        }}
        onItemPointerEnter={(id) => {
          if (id === "about") {
            preloadAboutHeroImages();
          }
        }}
        speed={50}
        trailing={
          <button
            aria-label={nextScheme === "dark" ? "Switch to dark mode" : "Switch to light mode"}
            className={styles.themeButton}
            data-state={colorScheme === "dark" ? "sun" : "moon"}
            onClick={() => {
              applyColorSchemeWithTransition(nextScheme);
              setColorScheme(nextScheme);
            }}
            type="button"
          >
            <MoonIcon
              aria-hidden="true"
              className={styles.themeIcon}
              data-icon="moon"
              height={20}
              strokeWidth={2}
              width={20}
            />
            <SunIcon
              aria-hidden="true"
              className={styles.themeIcon}
              data-icon="sun"
              height={20}
              strokeWidth={2}
              width={20}
            />
          </button>
        }
      />
    </header>
  );
}
