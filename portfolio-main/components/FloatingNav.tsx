"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, type MouseEvent, useEffect, useState } from "react";
import { AboutIcon, HomeIcon, WorkIcon, WritingIcon } from "./icons";
import styles from "./FloatingNav.module.css";

const navItems = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "projects", label: "Projects", href: "/#projects", icon: WorkIcon },
  { id: "writings", label: "Writings", href: "/writings", icon: WritingIcon },
  { id: "about", label: "About", href: "/about", icon: AboutIcon }
] as const;

type NavItemId = (typeof navItems)[number]["id"];

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
  const activeIndex = Math.max(
    navItems.findIndex(({ id }) => id === activeItem),
    0
  );

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: NavItemId) => {
    setActiveItem(id);

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

  return (
    <header className={styles.header}>
      <nav
        aria-label="Primary navigation"
        className={styles.nav}
        style={{ "--active-index": activeIndex } as CSSProperties}
      >
        <span aria-hidden="true" className={styles.activeIndicator} />
        {navItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = activeItem === id;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              className={isActive ? styles.activeItem : styles.item}
              href={href}
              key={id}
              onClick={(event) => handleNavClick(event, id)}
            >
              <Icon aria-hidden="true" className={styles.icon} strokeWidth={1.8} />
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
