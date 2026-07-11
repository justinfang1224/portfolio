"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { MotionReveal } from "@/components/MotionReveal";
import { Tag } from "@/components/Tag";
import { projects } from "@/content/portfolio";
import styles from "./page.module.css";

const projectCards = [
  {
    ...projects[0],
    image: "/images/landing/home-featured-work.png",
    imageClassName: "delphiImage"
  },
  {
    ...projects[1],
    imageClassName: "creditCardImage"
  },
  {
    ...projects[2],
    title: "Optimizing OKX’s deposit experience",
    imageClassName: "okxImage"
  },
  {
    ...projects[3],
    description:
      "This design initiative introduces a smart filter feature, improving usability, reducing repetitive tasks, and enabling easy sharing across the team to streamline workflows and minimize mistakes.",
    imageClassName: "bowtieImage",
    title: "An intuitive filter widget that improved insurance underwriter’s efficiency"
  }
] as const;

const archivedWorks = [
  {
    description: "A regulated prediction marketplace that facilitates real-world forecasting.",
    href: "https://og.com",
    tag: "App",
    title: "OG.com",
    year: "2026"
  },
  {
    description: "A written piece of work exploring the question: “Is a zebra black or white?”",
    href: null,
    tag: "Writing",
    title: "Zebra Zine",
    year: "2026"
  },
  {
    description:
      "Revamped Crypto.com P2P Payments feature, enabling user to send fiat and crypto freely. Drove 14.6M transfer volume & 40% user retention.",
    href: "https://x.com/cryptocom/status/1973660800255439301",
    tag: "Feature",
    title: "P2P Transfer",
    year: "2025"
  },
  {
    description: "An AI-powered digital companion app built with a unique, distinct personality.",
    href: null,
    tag: "App",
    title: "VA",
    year: "2025"
  },
  {
    description: "A playful graphic zine made by a collective of 12 young artists based in Hong Kong.",
    href: null,
    tag: "Graphic",
    title: "Can-Do Zine",
    year: "2024"
  },
  {
    description:
      "An experimental endeavor that explored books, book culture, community, and the role of design in offering readers an alternative way to indulge in literature.",
    href: null,
    tag: "Concept",
    title: "Bookthrough",
    year: "2023"
  }
] as const;

type ProjectCard = (typeof projectCards)[number];
type ProjectsTab = "case-studies" | "archive";

function ProjectIndexCard({ project, priority }: { project: ProjectCard; priority: boolean }) {
  const statusLabel = project.status === "active" ? "Active" : "Locked";
  const statusTone = project.status === "active" ? "positive" : "warning";
  const image = (
    <>
      <Badge className={styles.statusBadge} status={statusTone}>
        {statusLabel}
      </Badge>
      <Image
        alt={project.alt}
        className={[styles.projectImage, styles[project.imageClassName]].join(" ")}
        height={528}
        priority={priority}
        sizes="(max-width: 767px) calc(100vw - 48px), 796px"
        src={project.image}
        width={796}
      />
    </>
  );

  return (
    <article className={styles.projectCard}>
      {project.detailHref ? (
        <Link
          aria-label={`Open case study: ${project.title}`}
          className={styles.projectMedia}
          href={project.detailHref}
        >
          {image}
        </Link>
      ) : (
        <div className={styles.projectMedia}>{image}</div>
      )}
      <div className={styles.projectContent}>
        <div className={styles.projectCopy}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
        <div className={styles.tags} aria-label={`${project.title} categories`}>
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectsIndex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTab: ProjectsTab = searchParams.get("tab") === "archive" ? "archive" : "case-studies";
  const [visibleTab, setVisibleTab] = useState<ProjectsTab>(selectedTab);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [hasTappedTab, setHasTappedTab] = useState(false);
  const isArchive = visibleTab === "archive";

  const setActiveTab = (tab: ProjectsTab) => {
    if (tab === selectedTab) {
      return;
    }

    setHasTappedTab(true);
    router.replace(tab === "archive" ? "/projects?tab=archive" : "/projects", { scroll: false });
  };

  useEffect(() => {
    if (selectedTab === visibleTab) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setVisibleTab(selectedTab);
      setIsPanelVisible(true);
      return;
    }

    setIsPanelVisible(false);

    const timeoutId = window.setTimeout(() => {
      setVisibleTab(selectedTab);
      window.requestAnimationFrame(() => setIsPanelVisible(true));
    }, 160);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [selectedTab, visibleTab]);

  return (
    <main className={[styles.main, isArchive ? styles.archiveMain : ""].filter(Boolean).join(" ")}>
      <MotionReveal as="section" aria-labelledby="projects-title" className={styles.intro}>
        <div className={styles.tabs} aria-label="Project filters" role="tablist">
          <button
            aria-selected={selectedTab === "case-studies"}
            className={selectedTab === "case-studies" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setActiveTab("case-studies")}
            role="tab"
            type="button"
          >
            <span
              aria-hidden="true"
              className={[styles.tabDot, selectedTab === "case-studies" ? "" : styles.hiddenTabDot]
                .filter(Boolean)
                .join(" ")}
            />
            <span>Case study</span>
            <span
              aria-hidden={selectedTab === "case-studies" ? undefined : "true"}
              className={[
                styles.tabCount,
                selectedTab === "case-studies" ? "" : styles.hiddenTabCount,
                selectedTab === "case-studies" && hasTappedTab ? styles.tabCountSlideIn : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              4
            </span>
          </button>
          <button
            aria-selected={selectedTab === "archive"}
            className={selectedTab === "archive" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setActiveTab("archive")}
            role="tab"
            type="button"
          >
            <span
              aria-hidden="true"
              className={[
                styles.tabDot,
                styles.archiveTabDot,
                selectedTab === "archive" ? "" : styles.hiddenTabDot
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <span>Archived</span>
            <span
              aria-hidden={selectedTab === "archive" ? undefined : "true"}
              className={[
                styles.tabCount,
                selectedTab === "archive" ? "" : styles.hiddenTabCount,
                selectedTab === "archive" && hasTappedTab ? styles.tabCountSlideIn : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              6
            </span>
          </button>
        </div>
        <div className={styles.headingGroup}>
          <h1 id="projects-title">{isArchive ? "Archived works 📂" : "Office hours 🕐"}</h1>
          <p>
            {isArchive
              ? "Selected works and creative side projects outside of my case studies."
              : "Brief documentation of the featured projects. Detailed case study provide upon request."}
          </p>
        </div>
      </MotionReveal>

      <div
        className={[styles.tabPanel, isPanelVisible ? styles.tabPanelVisible : styles.tabPanelHidden]
          .filter(Boolean)
          .join(" ")}
      >
        {isArchive ? (
          <section aria-label="Archived works" className={styles.archiveList}>
            {archivedWorks.map((work, index) => (
              <MotionReveal
                as="article"
                className={styles.archiveItem}
                delay={Math.min(index, 5) * 40}
                key={`${work.year}-${work.title}`}
              >
                <p className={styles.archiveYear}>{work.year}</p>
                {work.href ? (
                  <a className={styles.archiveTitleLink} href={work.href} rel="noreferrer" target="_blank">
                    {work.title}
                  </a>
                ) : (
                  <h2 className={styles.archiveTitle}>{work.title}</h2>
                )}
                <div className={styles.archiveTag}>
                  <Tag>{work.tag}</Tag>
                </div>
                <p className={styles.archiveDescription}>{work.description}</p>
              </MotionReveal>
            ))}
          </section>
        ) : (
          <section aria-label="Project case studies" className={styles.projectList}>
            {projectCards.map((project, index) => (
              <MotionReveal delay={Math.min(index, 3) * 60} key={project.title}>
                <ProjectIndexCard priority={index === 0} project={project} />
              </MotionReveal>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
