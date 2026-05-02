import type { Metadata } from "next";
import Link from "next/link";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { ArrowUpRightIcon } from "@/components/icons";
import { MotionReveal } from "@/components/MotionReveal";
import { writingsPage } from "@/content/portfolio";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Writings - Justin Fang",
  description: "Notes around design, art, and technology by Justin Fang."
};

export default function WritingsPage() {
  return (
    <>
      <FloatingNav />
      <main className={styles.main}>
        <MotionReveal as="section" aria-labelledby="writings-page-title" className={styles.hero}>
          <p className={styles.index}>{writingsPage.index}</p>
          <h1 className={styles.title} id="writings-page-title">
            {writingsPage.title}
          </h1>
          <p className={styles.description}>{writingsPage.description}</p>
        </MotionReveal>

        <section aria-label="Writing list" className={styles.list}>
          {writingsPage.entries.map((writing, index) => {
            const href = writing.href ?? "#";

            return (
              <MotionReveal
                as="article"
                className={styles.item}
                delay={Math.min(index, 3) * 60}
                key={writing.title}
              >
                <Link className={styles.itemLink} href={href}>
                  <div className={styles.itemText}>
                    <h2 className={styles.itemTitle}>{writing.title}</h2>
                    <p className={styles.meta}>
                      <span>{writing.date}</span>
                      <span aria-hidden="true">•</span>
                      <span>{writing.category}</span>
                    </p>
                  </div>
                  <ArrowUpRightIcon className={styles.arrow} />
                </Link>
              </MotionReveal>
            );
          })}
        </section>

        <MotionReveal delay={60}>
          <p className={styles.note}>{writingsPage.note}</p>
        </MotionReveal>
      </main>
      <Footer width="text" />
    </>
  );
}
