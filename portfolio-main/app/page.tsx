import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/Button";
import { TermExplain } from "@/components/TermExplain";
import { UpdatedAtTypewriter } from "@/components/UpdatedAtTypewriter";
import { WritingList } from "@/components/WritingList";
import { profile, writings } from "@/content/portfolio";
import { getLastUpdatedLabel } from "@/lib/get-last-updated";
import { HomeFeaturedCarousel } from "./HomeFeaturedCarousel";
import styles from "./page.module.css";

const APPEAR_STEP_MS = 60;

function withAppear(className: string, step: number) {
  return {
    className: `${className} ${styles.appear}`,
    style: { "--appear-delay": `${step * APPEAR_STEP_MS}ms` } as CSSProperties
  };
}

function CompanyLink({
  company
}: {
  company: {
    explanation?: string;
    href: string;
    label: string;
    logoAlt: string;
    logoSrc: string;
  };
}) {
  const label = company.explanation ? (
    <TermExplain asChild explanation={company.explanation}>
      <span>{company.label}</span>
    </TermExplain>
  ) : (
    <span>{company.label}</span>
  );

  return (
    <a className={`${styles.companyLink} text-link`} href={company.href} rel="noreferrer" target="_blank">
      <Image
        alt={company.logoAlt}
        className={styles.companyLogo}
        height={16}
        sizes="16px"
        src={company.logoSrc}
        width={16}
      />
      {label}
    </a>
  );
}

export default function Home() {
  const writingEntries = writings.filter((writing) =>
    [
      "/writings/workflow-optimization-within-figma",
      "/writings/ethnographic-research-at-a-local-park-in-hong-kong"
    ].includes(writing.href)
  );

  return (
    <>
      <main className={styles.main}>
        <section aria-labelledby="home-title" className={styles.intro}>
          <div className={styles.identity}>
            <div className={styles.identityCopy}>
              <h3 {...withAppear(styles.name, 0)} id="home-title">
                {profile.name}
              </h3>
              <p {...withAppear(styles.role, 1)}>
                Senior Product Designer
                <span className={styles.roleUpdated}>
                  <span aria-hidden="true" className={styles.roleSeparator}>
                    {"  •  "}
                  </span>
                  <UpdatedAtTypewriter inline value={getLastUpdatedLabel()} />
                </span>
              </p>
            </div>
          </div>
          <p {...withAppear(styles.prose, 2)}>
            I&apos;m a Product designer in the field of financial technology. In the past 2 years,
            I&apos;ve designed web3.0 trading experience for{" "}
            <CompanyLink company={profile.introCompany} />. Specifically building in the domain of
            Credit card, Platform AI, and prediction markets. Before that I was a designer (at){" "}
            {profile.introPreviousCompanies.map((company, index) => (
              <span key={company.href}>
                <CompanyLink company={company} />
                {index < profile.introPreviousCompanies.length - 1 ? " & " : null}
              </span>
            ))}
            .
          </p>
          <p {...withAppear(styles.closing, 3)}>
            I consider myself a designer at heart and enjoy building products with care & taste.
            Now I enjoy shipping things myself with the assistance of code & AI.
          </p>
          <div {...withAppear(styles.introActions, 4)}>
            <Button href="/about">About me</Button>
            <Button href="/projects">All work →</Button>
          </div>
        </section>

        <section {...withAppear(styles.workSection, 5)} aria-label="Featured work" id="projects">
          <HomeFeaturedCarousel />
        </section>

        <section {...withAppear(styles.writings, 6)} aria-labelledby="writings-title" id="writings">
          <div className={styles.sectionHeader}>
            <h3 id="writings-title">Writings</h3>
          </div>
          <WritingList embedded entries={writingEntries} flushLast />
          <Button href="/writings">View all →</Button>
        </section>
      </main>
    </>
  );
}
