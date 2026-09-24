import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DesignSystemAudit } from "@/components/dev/DesignSystemAudit";
import { Footer } from "@/components/Footer";
import { LandingSplash } from "@/components/LandingSplash";
import { RouteFade } from "@/components/RouteFade";
import { SmoothScroll } from "@/components/SmoothScroll";
import { colorSchemeScript } from "@/lib/color-scheme";
import "./globals.css";

export const metadata: Metadata = {
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
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
      <body>
        <LandingSplash />
        <div className="portfolio-content-shell">
          <SmoothScroll>
            <RouteFade>
              {children}
              <Footer />
            </RouteFade>
          </SmoothScroll>
        </div>
        {process.env.NODE_ENV === "development" ? <DesignSystemAudit /> : null}
      </body>
    </html>
  );
}
