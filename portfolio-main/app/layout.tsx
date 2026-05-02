import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LandingSplash } from "@/components/LandingSplash";
import { RouteFade } from "@/components/RouteFade";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Justin Fang - Product Designer",
  description:
    "Portfolio landing page for Justin Fang, product designer in financial technology and web3 experiences.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LandingSplash />
        <div className="portfolio-content-shell">
          <SmoothScroll>
            <RouteFade>{children}</RouteFade>
          </SmoothScroll>
        </div>
      </body>
    </html>
  );
}
