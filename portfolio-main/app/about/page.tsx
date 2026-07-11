import type { Metadata } from "next";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { AboutCollage } from "@/components/about/AboutCollage";
import { AboutFavorites } from "@/components/about/AboutFavorites";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { MotionReveal } from "@/components/MotionReveal";
import { aboutEducation, aboutExperience, aboutFavorites, aboutIntro } from "@/content/about";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About - Justin Fang",
  description:
    "About Justin Fang, product designer specializing in design research, fintech, and product development."
};

function SectionHeader({
  index,
  title,
  titleId
}: {
  index: string;
  title: string;
  titleId: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <p className={styles.index}>{index}</p>
      <h2 className={styles.sectionTitle} id={titleId}>
        {title}
      </h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <FloatingNav />
      <main className={styles.main}>
        <MotionReveal as="section" aria-label="About photo collage" className={styles.hero}>
          <AboutCollage />
        </MotionReveal>

        <div className={styles.content}>
          <MotionReveal
            as="section"
            aria-labelledby="about-intro-title"
            className={styles.introSection}
          >
            <p className={styles.index}>{aboutIntro.index}</p>
            <h1 className={styles.title} id="about-intro-title">
              {aboutIntro.title}
            </h1>
            <div className={styles.prose}>
              <p>
                I was born in{" "}
                <a href={aboutIntro.city.href} rel="noreferrer" target="_blank">
                  {aboutIntro.city.label}
                </a>
                , a city cradled by perpetual rains in Taiwan.
              </p>
              <p>
                In 2017, I visited Hong Kong for the first time and felt drawn to the city&apos;s
                distinct energy. That connection brought me back to study{" "}
                {aboutIntro.discipline.label} at{" "}
                <a href={aboutIntro.school.href} rel="noreferrer" target="_blank">
                  {aboutIntro.school.label}
                </a>
                , where I focused on visual &amp; graphic work, and I eventually decided to stay and
                build my career here.
              </p>
              <p>{aboutIntro.paragraphs[0]}</p>
              <p>
                Beyond tech &amp; design, I lean into a broad appreciation spending my time with
                books, movies, nature (
                <a href="#about-favorites-title">see my favorites here</a>), and everything between
                culture &amp; humanities.
              </p>
            </div>
            <div className={styles.socials}>
              <p>{aboutIntro.socialLabel} →</p>
              <div className={styles.socialLinks}>
                {aboutIntro.socialLinks.map((link, index) => (
                  <span className={styles.socialItem} key={link.label}>
                    <a
                      href={link.href}
                      rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    >
                      {link.label}
                    </a>
                    {index < aboutIntro.socialLinks.length - 1 ? (
                      <span aria-hidden="true" className={styles.socialSeparator}>
                        •
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal
            as="section"
            aria-labelledby="about-experience-title"
            className={styles.timelineSection}
            delay={60}
          >
            <SectionHeader
              index={aboutExperience.index}
              title={aboutExperience.title}
              titleId="about-experience-title"
            />
            <AboutTimeline entries={aboutExperience.entries} expandable />
          </MotionReveal>

          <MotionReveal
            as="section"
            aria-labelledby="about-education-title"
            className={styles.timelineSection}
            delay={120}
          >
            <SectionHeader
              index={aboutEducation.index}
              title={aboutEducation.title}
              titleId="about-education-title"
            />
            <AboutTimeline entries={aboutEducation.entries} inlineDate />
          </MotionReveal>

          <MotionReveal
            as="section"
            aria-labelledby="about-favorites-title"
            className={styles.timelineSection}
            delay={180}
            id="favorites"
          >
            <SectionHeader
              index={aboutFavorites.index}
              title={aboutFavorites.title}
              titleId="about-favorites-title"
            />
            <AboutFavorites />
          </MotionReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
