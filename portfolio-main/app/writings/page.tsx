import type { Metadata } from "next";
import { WritingList } from "@/components/WritingList";
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
      <main className={styles.main}>
        <MotionReveal as="section" aria-labelledby="writings-page-title" className={styles.hero}>
          <h2 className={styles.title} id="writings-page-title">
            {writingsPage.title}
          </h2>
          <p className={styles.description}>{writingsPage.description}</p>
        </MotionReveal>

        <WritingList embedded entries={writingsPage.entries} />

      </main>
    </>
  );
}
