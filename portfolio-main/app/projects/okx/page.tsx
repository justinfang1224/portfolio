import type { Metadata } from "next";
import Link from "next/link";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectHeroParallax } from "@/components/projects/ProjectHeroParallax";
import { ProjectSectionRail } from "@/components/projects/ProjectSectionRail";
import { RollingMetricValue } from "@/components/projects/RollingMetricValue";
import { ScrollAutoplayVideo } from "@/components/projects/ScrollAutoplayVideo";
import { okxProjectDetail } from "@/content/portfolio";
import styles from "./page.module.css";

type RichTextSegment = {
  highlight?: boolean;
  text: string;
};

type RichTextParagraph = readonly RichTextSegment[];

export const metadata: Metadata = {
  title: "Optimizing OKX's Deposit Experience - Justin Fang",
  description:
    "A product design case study about improving OKX deposit conversion through data-informed information architecture."
};

function RichParagraph({
  paragraph
}: {
  paragraph: RichTextParagraph;
}) {
  return (
    <p>
      {paragraph.map((segment, index) => {
        const isHighlighted = "highlight" in segment && segment.highlight;

        return isHighlighted ? (
          <span className={styles.highlight} key={`${segment.text}-${index}`}>
            {segment.text}
          </span>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        );
      })}
    </p>
  );
}

export default function OkxProjectPage() {
  return (
    <>
      <FloatingNav />
      <main className={styles.main}>
        <MotionReveal as="section" aria-label="OKX deposit experience hero" className={styles.hero}>
          <ProjectHeroParallax
            alt={okxProjectDetail.hero.alt}
            className={styles.heroMedia}
            imageClassName={styles.heroImage}
            src={okxProjectDetail.hero.image}
          />
        </MotionReveal>

        <div className={styles.caseStudyShell}>
          <ProjectSectionRail items={okxProjectDetail.navItems} />

          <div className={styles.content}>
            <MotionReveal as="section" className={styles.intro} id="intro">
              <div className={styles.introHeader}>
                <p className={styles.index}>{okxProjectDetail.intro.year}</p>
                <h1 className={styles.title}>{okxProjectDetail.intro.title}</h1>
                <p className={styles.summary}>{okxProjectDetail.intro.summary}</p>
              </div>

              <dl className={styles.details}>
                {okxProjectDetail.intro.details.map((detail) => (
                  <div className={styles.detailRow} key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>

              <a
                className={styles.button}
                href={okxProjectDetail.newsHref}
                rel="noreferrer"
                target="_blank"
              >
                View feature
              </a>
            </MotionReveal>

            <MotionReveal className={styles.divider} delay={60}>
              <span aria-hidden="true" />
            </MotionReveal>

            <MotionReveal as="section" aria-label="Project metrics" className={styles.metrics} delay={80}>
              {okxProjectDetail.metrics.map((metric) => (
                <div className={styles.metric} key={metric.label}>
                  <RollingMetricValue value={metric.value} />
                  <span>{metric.label}</span>
                </div>
              ))}
            </MotionReveal>

            <MotionReveal className={styles.divider} delay={100}>
              <span aria-hidden="true" />
            </MotionReveal>

            <div className={styles.sections}>
              {okxProjectDetail.sections.map((section, sectionIndex) => (
                <MotionReveal
                  as="section"
                  className={styles.section}
                  delay={Math.min(sectionIndex, 3) * 60}
                  id={section.id}
                  key={section.id}
                >
                  <h2 className={styles.sectionTitle}>{section.heading}</h2>

                  {section.blocks.map((block, blockIndex) => {
                    if (block.kind === "prose") {
                      return (
                        <div className={styles.proseBlock} key={`${section.id}-prose-${blockIndex}`}>
                          {"heading" in block ? (
                            <h3 className={styles.blockTitle}>{block.heading}</h3>
                          ) : null}
                          <div className={styles.prose}>
                            {block.paragraphs.map((paragraph, paragraphIndex) => (
                              <RichParagraph
                                key={`${section.id}-${blockIndex}-${paragraphIndex}`}
                                paragraph={paragraph}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (block.kind === "list") {
                      return (
                        <div className={styles.proseBlock} key={`${section.id}-list-${blockIndex}`}>
                          {"heading" in block ? (
                            <h3 className={styles.blockTitle}>{block.heading}</h3>
                          ) : null}
                          <ul className={styles.list}>
                            {block.items.map((item) => (
                              <li key={item.label}>
                                <span className={styles.highlight}>{item.label}</span>
                                <span>{` -> ${item.text}`}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    if (block.kind === "video") {
                      return (
                        <figure className={styles.imageBlock} key={`${section.id}-video-${blockIndex}`}>
                          <div className={styles.imageItem}>
                            <div className={styles.videoFrame}>
                              <ScrollAutoplayVideo
                                className={styles.caseVideo}
                                label={block.label}
                                src={block.src}
                              />
                            </div>
                            <figcaption className={styles.caption}>{block.caption}</figcaption>
                          </div>
                        </figure>
                      );
                    }

                    return (
                      <figure
                        className={
                          block.images.length > 1 ? styles.imageGrid : styles.imageBlock
                        }
                        key={`${section.id}-image-${blockIndex}`}
                      >
                        {block.images.map((image) => (
                          <div className={styles.imageItem} key={image.src}>
                            <div className={styles.imageFrame}>
                              <img alt={image.alt} className={styles.caseImage} src={image.src} />
                            </div>
                            {"caption" in image && image.caption ? (
                              <figcaption className={styles.caption}>{image.caption}</figcaption>
                            ) : null}
                          </div>
                        ))}
                      </figure>
                    );
                  })}
                </MotionReveal>
              ))}
            </div>

            <MotionReveal className={styles.actions} delay={80}>
              <Link className={styles.button} href={okxProjectDetail.actions.back.href}>
                {okxProjectDetail.actions.back.label}
              </Link>
              <Link className={styles.button} href={okxProjectDetail.actions.next.href}>
                {okxProjectDetail.actions.next.label}
              </Link>
            </MotionReveal>
          </div>
        </div>
      </main>
      <Footer width="content" />
    </>
  );
}
