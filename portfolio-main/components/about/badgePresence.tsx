"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type BadgePresenceValue = {
  ready: boolean;
  setReady: (ready: boolean) => void;
};

const BadgePresenceContext = createContext<BadgePresenceValue | null>(null);

export function BadgePresence({ children }: { children: ReactNode }) {
  const onAbout = usePathname() === "/about";
  const [ready, setReady] = useState(false);
  const [trackedAbout, setTrackedAbout] = useState(onAbout);

  if (onAbout !== trackedAbout) {
    setTrackedAbout(onAbout);
    if (!onAbout) {
      setReady(false);
    }
  }

  const value = useMemo(() => ({ ready, setReady }), [ready]);

  return <BadgePresenceContext.Provider value={value}>{children}</BadgePresenceContext.Provider>;
}

export function useBadgePresence() {
  return useContext(BadgePresenceContext) ?? { ready: false, setReady: () => undefined };
}
