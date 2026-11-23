"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import {
  catalogCategories,
  catalogCategoryLabels,
  catalogItems,
  type CatalogCategory,
  type CatalogItem
} from "@/content/catalog";
import styles from "./CatalogGrid.module.css";

type FilterId = "all" | CatalogCategory;

const FILTER_SWAP_MS = 110;

const categoryCounts = catalogCategories.reduce(
  (counts, category) => {
    counts[category] = catalogItems.filter((item) => item.category === category).length;
    return counts;
  },
  {} as Record<CatalogCategory, number>
);

function filterItems(filter: FilterId): CatalogItem[] {
  if (filter === "all") {
    return catalogItems;
  }

  return catalogItems.filter((item) => item.category === filter);
}

export function CatalogGrid() {
  const filtersId = useId();
  const [filter, setFilter] = useState<FilterId>("all");
  const [visible, setVisible] = useState(true);
  const [items, setItems] = useState(() => filterItems("all"));
  const [hasTappedTab, setHasTappedTab] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setItems(filterItems(filter));
      setVisible(true);
      return;
    }

    setVisible(false);
    const timeoutId = window.setTimeout(() => {
      setItems(filterItems(filter));
      window.requestAnimationFrame(() => setVisible(true));
    }, FILTER_SWAP_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [filter]);

  const selectFilter = (next: FilterId) => {
    if (next === filter) {
      return;
    }

    setHasTappedTab(true);
    setFilter(next);
  };

  return (
    <div className={styles.root}>
      <div aria-label="Catalog categories" className={styles.filters} role="tablist">
        <div className={styles.filtersTrack}>
          <button
            aria-controls={filtersId}
            aria-selected={filter === "all"}
            className={filter === "all" ? styles.activeTab : styles.inactiveTab}
            onClick={() => selectFilter("all")}
            role="tab"
            type="button"
          >
            <span>All</span>
            <span
              aria-hidden={filter === "all" ? undefined : "true"}
              className={[
                styles.tabCount,
                filter === "all" ? "" : styles.hiddenTabCount,
                filter === "all" && hasTappedTab ? styles.tabCountSlideIn : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {catalogItems.length}
            </span>
          </button>
          {catalogCategories.map((category) => {
            const selected = filter === category;

            return (
              <button
                aria-controls={filtersId}
                aria-selected={selected}
                className={selected ? styles.activeTab : styles.inactiveTab}
                key={category}
                onClick={() => selectFilter(category)}
                role="tab"
                type="button"
              >
                <span>{catalogCategoryLabels[category]}</span>
                <span
                  aria-hidden={selected ? undefined : "true"}
                  className={[
                    styles.tabCount,
                    selected ? "" : styles.hiddenTabCount,
                    selected && hasTappedTab ? styles.tabCountSlideIn : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {categoryCounts[category]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul
        className={styles.grid}
        data-visible={visible ? "true" : "false"}
        id={filtersId}
      >
        {items.map((item) => (
          <li className={styles.item} key={item.id}>
            <article className={styles.card}>
              <div className={styles.imageFrame}>
                <img
                  alt={item.imageAlt}
                  className={styles.image}
                  src={item.imageSrc}
                  style={
                    item.imageScale
                      ? ({ "--catalog-image-scale": String(item.imageScale) } as CSSProperties)
                      : undefined
                  }
                />
              </div>
              <div className={styles.copy}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.brand}>{item.brand}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
