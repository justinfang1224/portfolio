import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { assetUrls } from "@/content/portfolio";
import { AboutCollage } from "@/components/about/AboutCollage";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { FloatingNav } from "@/components/FloatingNav";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard, type ProjectCardProject } from "@/components/ProjectCard";
import { ProjectHeroParallax } from "@/components/projects/ProjectHeroParallax";
import { ProjectSectionRail } from "@/components/projects/ProjectSectionRail";
import { SectionTitle } from "@/components/SectionTitle";
import { Tag } from "@/components/Tag";
import { WritingList } from "@/components/WritingList";
import { DesignSystemTabs } from "../.storybook/design-system/DesignSystemTabs";
import styles from "./DesignSystemPanel.module.css";

const componentSections = [
  { id: "section-one", label: "Section one" },
  { id: "section-two", label: "Section two" },
  { id: "section-three", label: "Section three" }
] as const;

const placeholderProject = {
  title: "Project title",
  description:
    "Short placeholder description that explains the project outcome and gives the card enough text to show spacing.",
  tags: ["Label one", "Label two"],
  image: assetUrls.projectCard,
  alt: "Placeholder project preview image.",
  imageClassName: "projectImagePhone",
  detailHref: null,
  status: "active"
} satisfies ProjectCardProject;

const colorTokens = [
  { name: "border-primary", value: "#EDEDED" },
  { name: "border-secondary", value: "#F0F0F0" },
  { name: "content-primary", value: "#111111" },
  { name: "content-secondary", value: "#737373" },
  { name: "content-tertiary", value: "#B3B3B3" },
  { name: "content-contrast", value: "#F9F9F7" },
  { name: "background-primary", value: "#F7F7F7" },
  { name: "background-secondary", value: "#F0F0F0" },
  { name: "surface-card-primary", value: "#F7F7F7" },
  { name: "surface-card-secondary", value: "#F0F0F0" },
  { name: "button-secondary-default", value: "#F5F5F5" },
  { name: "button-secondary-hover", value: "#EEEEEE" },
  { name: "button-secondary-pressed", value: "#E0E0E0" }
] as const;

const typographyTokens = [
  { name: "heading-1", size: 40, weight: 500, lineHeight: 48 },
  { name: "heading-2", size: 28, weight: 500, lineHeight: 36 },
  { name: "heading-3", size: 20, weight: 500, lineHeight: 28 },
  { name: "subtitle", size: 18, weight: 400, lineHeight: 28 },
  { name: "button", size: 15, weight: 500, lineHeight: 18 },
  { name: "body-large", size: 18, weight: 400, lineHeight: 30 },
  { name: "body-medium", size: 16, weight: 400, lineHeight: 27 },
  { name: "body-small", size: 14, weight: 400, lineHeight: 20 },
  { name: "caption", size: 12, weight: 400, lineHeight: 16 }
] as const;

const spacingTokens = [0, 4, 8, 12, 16, 20, 24, 36, 40, 48, 56, 64, 80, 100, 128, 190, 201] as const;

const placeholderTimelineEntries = [
  {
    company: "Company name",
    date: "2024 - Present",
    logoAlt: "Placeholder logo.",
    logoSrc: assetUrls.avatar,
    role: "Role title",
    team: "Team name"
  },
  {
    company: "Organization name",
    date: "2022 - 2024",
    logoAlt: "Placeholder logo.",
    logoSrc: assetUrls.avatar,
    role: "Role title",
    team: "Team name"
  },
  {
    company: "Institution name",
    date: "2020 - 2022",
    logoAlt: "Placeholder logo.",
    logoSrc: assetUrls.avatar,
    role: "Program title"
  }
] as const;

const placeholderWritings = [
  {
    title: "Article title placeholder",
    date: "Published on 01.01.2026",
    category: "Category label",
    href: "#"
  },
  {
    title: "Another article title",
    date: "Published on 02.01.2026",
    category: "Category label",
    href: "#"
  },
  {
    title: "Third article title",
    date: "Published on 03.01.2026",
    category: "Category label",
    href: "#"
  }
] as const;

function ComponentCard({
  children,
  description,
  isLarge = false,
  title
}: {
  children: ReactNode;
  description: string;
  isLarge?: boolean;
  title: string;
}) {
  return (
    <article className={`${styles.componentCard} ${isLarge ? styles.componentCardLarge : ""}`}>
      <div className={styles.componentHeader}>
        <h2 className={styles.componentTitle}>{title}</h2>
        <p className={styles.componentDescription}>{description}</p>
      </div>
      {children}
    </article>
  );
}

const meta = {
  title: "Design System/Panel",
  parameters: {
    docs: {
      description: {
        component:
          "A portfolio-styled visual panel for browsing design system components by category."
      }
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <DesignSystemTabs
      eyebrow="Portfolio Design System"
      title="Component Panel"
      groups={[
        {
          id: "tokens",
          label: "Tokens",
          summary: "Foundational color, typography, and spacing values used by the portfolio system.",
          children: (
            <div className={styles.tokenGrid}>
              <ComponentCard description="Semantic color variables used across surfaces, text, borders, and controls." isLarge title="Color">
                <div className={styles.tokenList}>
                  {colorTokens.map((token) => (
                    <div className={styles.colorToken} key={token.name}>
                      <div className={styles.tokenMeta}>
                        <p className={styles.tokenName}>{token.name}</p>
                        <p className={styles.tokenValue}>{token.value}</p>
                      </div>
                      <span
                        aria-label={`${token.name} color swatch`}
                        className={styles.swatch}
                        style={{ background: token.value }}
                      />
                    </div>
                  ))}
                </div>
              </ComponentCard>
              <ComponentCard description="Text styles with size, weight, and line-height values." isLarge title="Typography">
                <div className={styles.tokenList}>
                  {typographyTokens.map((token) => (
                    <div className={styles.typeToken} key={token.name}>
                      <div className={styles.tokenMeta}>
                        <p
                          className={styles.typePreview}
                          style={{
                            fontSize: token.size,
                            fontWeight: token.weight,
                            lineHeight: `${token.lineHeight}px`
                          }}
                        >
                          {token.name}
                        </p>
                        <p className={styles.tokenValue}>
                          {token.size}px / {token.lineHeight}px / {token.weight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentCard>
              <ComponentCard description="Spacing scale shown in pixels with proportional bars." isLarge title="Spacing">
                <div className={styles.tokenList}>
                  {spacingTokens.map((value) => (
                    <div className={styles.spacingToken} key={value}>
                      <div className={styles.tokenMeta}>
                        <p className={styles.tokenName}>spacing-{value}</p>
                        <p className={styles.tokenValue}>{value}px</p>
                      </div>
                      <span className={styles.spacingPreview} style={{ width: Math.max(value, 4) }} />
                    </div>
                  ))}
                </div>
              </ComponentCard>
            </div>
          )
        },
        {
          id: "primitives",
          label: "Primitives",
          summary: "Core reusable pieces for actions, labels, chips, and section headers.",
          children: (
            <div className={styles.grid}>
              <ComponentCard description="Secondary pill action used across hero and section CTAs." title="Button">
                <div className={styles.previewRow}>
                  <Button>Primary action</Button>
                  <Button>Secondary action</Button>
                </div>
              </ComponentCard>
              <ComponentCard description="Small and large status indicators for project state." title="Badge">
                <div className={styles.previewRow}>
                  <Badge status="neutral">Default</Badge>
                  <Badge status="positive">Positive</Badge>
                  <Badge status="warning">Warning</Badge>
                  <Badge size="l" status="positive">
                    Large label
                  </Badge>
                </div>
              </ComponentCard>
              <ComponentCard description="Compact metadata labels used on project cards." title="Tag">
                <div className={styles.chipRow}>
                  <Tag>Label one</Tag>
                  <Tag>Label two</Tag>
                  <Tag variant="contrast">Contrast label</Tag>
                </div>
              </ComponentCard>
              <ComponentCard description="Numbered section label and heading pair." title="SectionTitle">
                <SectionTitle index="01" title="Section title" />
              </ComponentCard>
            </div>
          )
        },
        {
          id: "navigation",
          label: "Navigation",
          summary: "Portfolio navigation patterns with pill states and lightweight motion.",
          children: (
            <div className={styles.grid}>
              <ComponentCard
                description="Primary icon dock styled with the same blurred pill container as the site."
                isLarge
                title="FloatingNav"
              >
                <div className={styles.navPreview}>
                  <FloatingNav />
                </div>
              </ComponentCard>
              <ComponentCard
                description="In-page section rail for long-form project detail pages."
                isLarge
                title="ProjectSectionRail"
              >
                <div className={styles.sectionMock}>
                  <ProjectSectionRail items={componentSections} />
                  <div className={styles.railMockContent}>
                    <h3 id="section-one">Section one</h3>
                    <p>Placeholder text shows how the active rail state appears beside page content.</p>
                    <h3 id="section-two">Section two</h3>
                    <p>Additional placeholder copy gives the preview a realistic content rhythm.</p>
                    <h3 id="section-three">Section three</h3>
                  </div>
                </div>
              </ComponentCard>
            </div>
          )
        },
        {
          id: "content",
          label: "Content",
          summary: "Portfolio-specific content blocks for projects, writings, and about pages.",
          children: (
            <div className={styles.stack}>
              <ComponentCard
                description="Featured work card with image, status badge, description, and tags."
                isLarge
                title="ProjectCard"
              >
                <div className={styles.projectCardPreview}>
                  <ProjectCard project={placeholderProject} />
                </div>
              </ComponentCard>
              <div className={styles.grid}>
                <ComponentCard description="Timeline rows for experience and education entries." isLarge title="AboutTimeline">
                  <AboutTimeline entries={placeholderTimelineEntries} />
                </ComponentCard>
                <ComponentCard description="Interactive image collage from the About page." isLarge title="AboutCollage">
                  <AboutCollage />
                </ComponentCard>
              </div>
              <ComponentCard description="Writing index section with linked entries and CTA." isLarge title="WritingList">
                <div className={styles.writingPreview}>
                  <WritingList
                    actionHref={null}
                    actionLabel="View all"
                    entries={placeholderWritings}
                    index="03"
                    sectionId="placeholder-writings"
                    title="List title"
                  />
                </div>
              </ComponentCard>
            </div>
          )
        },
        {
          id: "motion",
          label: "Motion",
          summary: "Motion helpers used to reveal content and add subtle depth to hero imagery.",
          children: (
            <div className={styles.grid}>
              <ComponentCard description="Intersection-based reveal wrapper with reduced-motion support." title="MotionReveal">
                <MotionReveal className={styles.motionSample}>
                  Content reveals with the portfolio fade and translate timing.
                </MotionReveal>
              </ComponentCard>
              <ComponentCard
                description="Scroll-responsive project hero image treatment."
                isLarge
                title="ProjectHeroParallax"
              >
                <ProjectHeroParallax
                  alt="Placeholder project cover."
                  className={styles.parallaxPreview}
                  imageClassName={styles.parallaxImage}
                  src={assetUrls.projectCard}
                />
              </ComponentCard>
            </div>
          )
        }
      ]}
    />
  )
};
