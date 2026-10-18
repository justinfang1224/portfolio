import { writings } from "@/content/portfolio";
import { dsMarker } from "@/lib/ds-marker";
import { Button } from "./Button";
import { MotionReveal } from "./MotionReveal";
import { SectionTitle } from "./SectionTitle";
import { WritingItem } from "./WritingItem";
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
  embedded?: boolean;
  entries?: readonly WritingEntry[];
  flushLast?: boolean;
  index?: string;
  sectionId?: string;
  showAction?: boolean;
  showHeading?: boolean;
  title?: string;
};

export function WritingList({
  actionHref = "/writings",
  actionLabel = "View all →",
  embedded = false,
  entries = writings,
  flushLast = false,
  index = "03",
  sectionId = "writings",
  showAction = true,
  showHeading = true,
  title = "Writings"
}: WritingListProps = {}) {
  const titleId = `${sectionId}-title`;
  const items = entries.map((writing, itemIndex) => (
    <WritingItem
      category={writing.category}
      date={writing.date}
      delay={Math.min(itemIndex, 2) * 60}
      flush={flushLast && itemIndex === entries.length - 1}
      href={writing.href}
      key={writing.title}
      title={writing.title}
    />
  ));

  if (embedded) {
    return <div className={styles.embedded}>{items}</div>;
  }

  return (
    <section
      aria-label={showHeading ? undefined : "Writing list"}
      aria-labelledby={showHeading ? titleId : undefined}
      className={styles.section}
      id={showHeading ? sectionId : undefined}
      {...dsMarker("WritingList")}
    >
      {showHeading ? (
        <MotionReveal>
          <SectionTitle id={titleId} index={index} title={title} />
        </MotionReveal>
      ) : null}
      <div className={styles.list}>{items}</div>
      {showAction ? (
        <MotionReveal delay={60}>
          <Button href={actionHref ?? undefined}>{actionLabel}</Button>
        </MotionReveal>
      ) : null}
    </section>
  );
}
