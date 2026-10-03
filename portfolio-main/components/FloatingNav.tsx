"use client";

import { animate } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useId, useRef, useState } from "react";
import { aboutCollageImages } from "@/content/about";
import {
  applyColorSchemeWithTransition,
  COLOR_SCHEME_EVENT,
  readStoredColorScheme,
  resolveColorScheme,
  type ResolvedColorScheme
} from "@/lib/color-scheme";
import { dsMarker } from "@/lib/ds-marker";
import { Button } from "./Button";
import { AboutIcon, HomeIcon, MenuIcon, ReplyIcon, WorkIcon, WritingIcon } from "./icons";
import { Toggle } from "./Toggle";
import styles from "./FloatingNav.module.css";

const navItems = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "projects", label: "Projects", href: "/projects", icon: WorkIcon },
  { id: "writings", label: "Writings", href: "/writings", icon: WritingIcon },
  { id: "about", label: "About", href: "/about", icon: AboutIcon }
] as const;

type NavItemId = (typeof navItems)[number]["id"];

const PANEL_WIDTH = 196;
const PANEL_HEIGHT = 172;
const SINK_MS = 60;

const shellSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
  mass: 0.5
};

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

export function FloatingNav() {
  const pathname = usePathname();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(false);
  const sinkTimer = useRef<number | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shellOn, setShellOn] = useState(false);
  const [sinking, setSinking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorScheme, setColorScheme] = useState<ResolvedColorScheme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return resolveColorScheme(readStoredColorScheme());
  });

  menuOpenRef.current = menuOpen;

  const showShell = () => {
    if (shellRef.current) {
      shellRef.current.style.opacity = "1";
    }

    setSinking(false);
    setShellOn(true);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    window.clearTimeout(sinkTimer.current);
    setSinking(false);
    setMenuOpen(false);
  };

  const openMenu = () => {
    if (reducedMotion) {
      showShell();
      return;
    }

    setSinking(true);
    window.clearTimeout(sinkTimer.current);
    sinkTimer.current = window.setTimeout(showShell, SINK_MS);
  };

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: NavItemId) => {
    closeMenu();

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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(sinkTimer.current);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell || (!menuOpen && !shellOn)) {
      return;
    }

    let cancelled = false;
    const animation = animate(
      shell,
      {
        width: menuOpen ? PANEL_WIDTH : "100%",
        height: menuOpen ? PANEL_HEIGHT : "100%",
        opacity: 1
      },
      reducedMotion
        ? { duration: 0 }
        : {
            width: shellSpring,
            height: shellSpring,
            opacity: { duration: 0 }
          }
    );

    animation.then(() => {
      if (cancelled || menuOpenRef.current) {
        return;
      }

      shell.style.opacity = "0";
      setShellOn(false);
    });

    return () => {
      cancelled = true;
      animation.stop();
    };
  }, [menuOpen, reducedMotion, shellOn]);

  useEffect(() => {
    closeMenu();
    // Close whenever the route changes, including the first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        menuRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

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
      <div className={styles.bar}>
        <div className={styles.controls}>
          <div className={styles.lead}>
            <div
              className={styles.menuSlot}
              data-open={menuOpen ? "true" : undefined}
              data-shell={shellOn ? "true" : undefined}
              data-sink={sinking ? "true" : undefined}
              ref={menuRef}
            >
            <div
              aria-hidden={shellOn ? undefined : true}
              className={styles.shell}
              ref={shellRef}
            >
              <nav aria-label="Primary" className={styles.menu} id={menuId} inert={menuOpen ? undefined : true}>
                {navItems.map((item, index) => (
                  <Link
                    className={styles.menuLink}
                    href={item.href}
                    key={item.id}
                    onClick={(event) => handleNavClick(event, item.id)}
                    onFocus={() => {
                      if (item.id === "about") {
                        preloadAboutHeroImages();
                      }
                    }}
                    onPointerEnter={() => {
                      if (item.id === "about") {
                        preloadAboutHeroImages();
                      }
                    }}
                    style={{ transitionDelay: menuOpen ? `${30 + index * 22}ms` : "0ms" }}
                  >
                    <item.icon aria-hidden="true" className={styles.menuIcon} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className={styles.face} inert={menuOpen ? true : undefined}>
              <Button
                aria-controls={menuId}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => (menuOpen ? closeMenu() : openMenu())}
                variant="outline"
              >
                <MenuIcon aria-hidden="true" height={18} strokeWidth={1.75} width={18} />
              </Button>
            </div>
            </div>
          </div>
          <div
            aria-hidden={pathname === "/" ? true : undefined}
            className={styles.backSlot}
            data-show={pathname !== "/" ? "true" : undefined}
            inert={pathname === "/" ? true : undefined}
          >
            <div className={styles.backPad}>
              <div className={styles.backMotion}>
                <Button aria-label="Go back" onClick={() => window.history.back()} variant="outline">
                  <ReplyIcon aria-hidden="true" height={18} strokeWidth={1.75} width={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Toggle
          aria-label="Dark mode"
          checked={colorScheme === "dark"}
          onChange={(checked) => {
            const nextScheme: ResolvedColorScheme = checked ? "dark" : "light";
            applyColorSchemeWithTransition(nextScheme);
            setColorScheme(nextScheme);
          }}
        />
      </div>
    </header>
  );
}
