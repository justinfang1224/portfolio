import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BadgePresence } from "@/components/about/badgePresence";
import { NameBadgeLayer } from "@/components/about/NameBadgeLayer";
import { NameBadgePreload } from "@/components/about/NameBadgePreload";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { DesignSystemAudit } from "@/components/dev/DesignSystemAudit";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { LandingSplash } from "@/components/LandingSplash";
import { RouteFade } from "@/components/RouteFade";
import { SmoothScroll } from "@/components/SmoothScroll";
import { colorSchemeScript } from "@/lib/color-scheme";
import "./globals.css";

function resolveMetadataBase() {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionHost) {
    return new URL(`https://${productionHost}`);
  }

  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost) {
    return new URL(`https://${deploymentHost}`);
  }

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "Justin Fang - Product Designer",
  description:
    "Portfolio landing page for Justin Fang, product designer in financial technology and web3 experiences.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png"
  },
  openGraph: {
    title: "Justin Fang",
    description:
      "Product designer in financial technology and web3 experiences.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Justin Fang",
    description:
      "Product designer in financial technology and web3 experiences."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html data-landing-splash="playing" lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/about/badge-card.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/about/badge-portrait.png" as="image" />
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
      <body>
        <NameBadgePreload />
        <LandingSplash />
        <BadgePresence>
          <div className="portfolio-content-shell">
            <FloatingNav />
            <SmoothScroll>
              <RouteFade>
                <NameBadgeLayer />
                {children}
                <Footer />
              </RouteFade>
            </SmoothScroll>
          </div>
        </BadgePresence>
        {process.env.NODE_ENV === "development" ? <DesignSystemAudit /> : null}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <SiteAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        ) : null}
      </body>
    </html>
  );
}
