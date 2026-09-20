import type { Metadata } from "next";
import type { ReactNode } from "react";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
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
