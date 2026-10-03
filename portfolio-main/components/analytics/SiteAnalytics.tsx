"use client";

import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

type SiteAnalyticsProps = {
  gaId: string;
};

function track(eventName: string, params: Record<string, string>) {
  sendGAEvent("event", eventName, params);
}

function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (lastPath.current === pagePath) {
      return;
    }

    const isFirstView = lastPath.current === null;
    lastPath.current = pagePath;

    // The Google tag config already sends the first page view.
    if (isFirstView) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      track("page_view", {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}

function ClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const element = target.closest("a, button");
      if (!(element instanceof HTMLElement)) {
        return;
      }

      if (element.closest("[data-ds-audit-root]")) {
        return;
      }

      const label = (element.getAttribute("aria-label") || element.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
      const href = element instanceof HTMLAnchorElement ? element.href : "";

      track("select_content", {
        content_type: element instanceof HTMLAnchorElement ? "link" : "button",
        link_url: href,
        link_text: label
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

export function SiteAnalytics({ gaId }: SiteAnalyticsProps) {
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
      <ClickTracking />
    </>
  );
}
