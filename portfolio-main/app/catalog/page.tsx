import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { MotionReveal } from "@/components/MotionReveal";
import { catalogPage } from "@/content/catalog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Objects - Justin Fang",
  description:
    "Objects I keep returning to — sports, tech, photography, albums, and more."
};

export default function CatalogPage() {
  return (
    <main className={styles.main}>
      <MotionReveal as="section" aria-labelledby="catalog-page-title" className={styles.hero}>
        <h2 className={styles.title} id="catalog-page-title">
          {catalogPage.title}
        </h2>
        <p className={styles.description}>
          {catalogPage.descriptionBefore}
          <a
            className="text-link"
            href={catalogPage.descriptionLinkHref}
            rel="noreferrer"
            target="_blank"
          >
            {catalogPage.descriptionLinkLabel}
          </a>
          {catalogPage.descriptionAfter}
        </p>
      </MotionReveal>

      <MotionReveal as="section" aria-label="Catalog items" className={styles.catalog} delay={60}>
        <CatalogGrid />
      </MotionReveal>
    </main>
  );
}
