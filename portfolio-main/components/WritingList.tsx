import Link from "next/link";
import { writings } from "@/content/portfolio";
import { Button } from "./Button";
import { ArrowUpRightIcon } from "./icons";
import { MotionReveal } from "./MotionReveal";
import { SectionTitle } from "./SectionTitle";
import styles from "./WritingList.module.css";

type WritingEntry = {
  category: string;
  date: string;
  href?: string;
  title: string;
};

type WritingListProps = {
  actionHref?: string | null;
  actionLabel?: string;
  entries?: readonly WritingEntry[];
  index?: string;
  sectionId?: string;
  title?: string;
};

export function WritingList({
  actionHref = "/writings",
  actionLabel = "View all →",
  entries = writings,
  index = "03",
  sectionId = "writings",
  title = "Writings ✍🏻"
}: WritingListProps = {}) {
  const titleId = `${sectionId}-title`;

  return (
    <section aria-labelledby={titleId} className={styles.section} id={sectionId}>
      <MotionReveal>
        <SectionTitle id={titleId} index={index} title={title} />
      </MotionReveal>
      <div className={styles.list}>
        {entries.map((writing, index) => {
          const href = writing.href ?? "#";

          return (
            <MotionReveal
              as="article"
              className={styles.item}
              delay={Math.min(index, 2) * 60}
              key={writing.title}
            >
              <Link className={styles.itemLink} href={href}>
                <div className={styles.itemText}>
                  <h3 className={styles.itemTitle}>{writing.title}</h3>
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
      </div>
      <MotionReveal delay={60}>
        <Button href={actionHref ?? undefined}>{actionLabel}</Button>
      </MotionReveal>
    </section>
  );
}
