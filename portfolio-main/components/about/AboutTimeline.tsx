"use client";

import { useState } from "react";
import styles from "./AboutTimeline.module.css";

type TimelineEntry = {
  company: string;
  companyHref?: string;
  date: string;
  details?: readonly string[];
  logoAlt: string;
  logoClassName?: string;
  logoSrc: string;
  role: string;
  team?: string;
};

type AboutTimelineProps = {
  entries: readonly TimelineEntry[];
  expandable?: boolean;
  inlineDate?: boolean;
};

export function AboutTimeline({
  entries,
  expandable = false,
  inlineDate = false
}: AboutTimelineProps) {
  const [expandedEntries, setExpandedEntries] = useState<ReadonlySet<string>>(new Set());

  const toggleEntry = (entryId: string) => {
    setExpandedEntries((currentEntries) => {
      const nextEntries = new Set(currentEntries);

      if (nextEntries.has(entryId)) {
        nextEntries.delete(entryId);
      } else {
        nextEntries.add(entryId);
      }

      return nextEntries;
    });
  };

  return (
    <div className={styles.list}>
      {entries.map((entry) => {
        const entryId = `${entry.company}-${entry.date}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const detailsId = `${entryId}-details`;
        const hasExpandableDetails = expandable && entry.details && entry.details.length > 0;
        const isExpanded = expandedEntries.has(entryId);
        const shouldInlineDate = hasExpandableDetails || inlineDate;
        const inlineMeta = shouldInlineDate ? entry.date.replace(/\s*-\s*/g, " → ") : entry.team;

        return (
          <article
            className={[styles.row, hasExpandableDetails ? styles.expandableRow : ""]
              .filter(Boolean)
              .join(" ")}
            key={entryId}
          >
            <div className={styles.summary}>
              <div className={styles.identity}>
                <div
                  className={[styles.logo, entry.logoClassName ? styles[entry.logoClassName] : ""]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <img alt={entry.logoAlt} height="48" src={entry.logoSrc} width="48" />
                </div>
                <div className={styles.copy}>
                  <h3 className={styles.company}>
                    {entry.companyHref ? (
                      <a href={entry.companyHref} rel="noreferrer" target="_blank">
                        {entry.company}
                      </a>
                    ) : (
                      entry.company
                    )}
                  </h3>
                  <p className={styles.role}>
                    <span>{entry.role}</span>
                    {inlineMeta ? (
                      <span className={styles.roleMeta}>
                        <span aria-hidden="true" className={styles.separator}>
                          •
                        </span>
                        {hasExpandableDetails ? (
                          <time>{inlineMeta}</time>
                        ) : (
                          <span>{inlineMeta}</span>
                        )}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
              {hasExpandableDetails ? (
                <button
                  aria-controls={detailsId}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${entry.company} experience details`}
                  className={styles.toggle}
                  onClick={() => toggleEntry(entryId)}
                  type="button"
                >
                  <span className={styles.toggleIcon} aria-hidden="true">
                    <span className={styles.toggleLineHorizontal} />
                    <span className={styles.toggleLineVertical} />
                  </span>
                </button>
              ) : (
                !shouldInlineDate ? <time className={styles.date}>{entry.date}</time> : null
              )}
            </div>
            {hasExpandableDetails ? (
              <div
                aria-hidden={!isExpanded}
                className={[styles.details, isExpanded ? styles.detailsExpanded : ""]
                  .filter(Boolean)
                  .join(" ")}
                id={detailsId}
              >
                <div className={styles.detailsContent}>
                  {entry.details?.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
