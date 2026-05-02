"use client";

import { type ReactNode, useId, useState } from "react";
import styles from "./DesignSystemTabs.module.css";

type DesignSystemTab = {
  children: ReactNode;
  id: string;
  label: string;
  summary: string;
};

type DesignSystemTabsProps = {
  eyebrow: string;
  groups: DesignSystemTab[];
  title: string;
};

export function DesignSystemTabs({ eyebrow, groups, title }: DesignSystemTabsProps) {
  const tabPrefix = useId();
  const [activeId, setActiveId] = useState(groups[0]?.id ?? "");
  const activeGroup = groups.find((group) => group.id === activeId) ?? groups[0];

  if (!activeGroup) {
    return null;
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.summary}>{activeGroup.summary}</p>
        </div>
      </div>

      <div aria-label="Design system component categories" className={styles.tabs} role="tablist">
        {groups.map((group) => {
          const isActive = group.id === activeGroup.id;
          const tabId = `${tabPrefix}-${group.id}-tab`;
          const panelId = `${tabPrefix}-${group.id}-panel`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={isActive}
              className={isActive ? styles.activeTab : styles.tab}
              id={tabId}
              key={group.id}
              onClick={() => setActiveId(group.id)}
              role="tab"
              type="button"
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {groups.map((group) => {
        const isActive = group.id === activeGroup.id;
        const tabId = `${tabPrefix}-${group.id}-tab`;
        const panelId = `${tabPrefix}-${group.id}-panel`;

        return (
          <div
            aria-labelledby={tabId}
            className={styles.tabPanel}
            hidden={!isActive}
            id={panelId}
            key={group.id}
            role="tabpanel"
          >
            {group.children}
          </div>
        );
      })}
    </section>
  );
}
