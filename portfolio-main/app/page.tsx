import Image from "next/image";
import { Button } from "@/components/Button";
import { MotionReveal } from "@/components/MotionReveal";
import { TermExplain } from "@/components/TermExplain";
import { UpdatedAtTypewriter } from "@/components/UpdatedAtTypewriter";
import { WritingList } from "@/components/WritingList";
import { profile, writings } from "@/content/portfolio";
import { getLastUpdatedLabel } from "@/lib/get-last-updated";
import { HomeFeaturedCarousel } from "./HomeFeaturedCarousel";
import styles from "./page.module.css";

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
        <MotionReveal as="section" aria-labelledby="home-title" className={styles.intro}>
          <div className={styles.identity}>
            <div className={styles.identityCopy}>
              <h3 className={styles.name} id="home-title">
                {profile.name}
              </h3>
              <p className={styles.role}>
                Senior Product Designer
                <span aria-hidden="true" className={styles.roleSeparator}>
                  {"  •  "}
                </span>
                <UpdatedAtTypewriter inline value={getLastUpdatedLabel()} />
              </p>
            </div>
          </div>
          <p className={styles.prose}>
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
          <p className={styles.closing}>
            I consider myself a designer at heart and enjoy building products with care & taste.
            Now I enjoy shipping things myself with the assistance of code & AI.
          </p>
          <div className={styles.introActions}>
            <Button href="/about">About me</Button>
            <Button href="/projects">All work →</Button>
          </div>
        </MotionReveal>

        <MotionReveal as="section" aria-label="Featured work" className={styles.workSection} id="projects">
          <HomeFeaturedCarousel />
        </MotionReveal>

        <MotionReveal as="section" aria-labelledby="writings-title" className={styles.writings} id="writings">
          <div className={styles.sectionHeader}>
            <h3 id="writings-title">Writings</h3>
          </div>
          <WritingList embedded entries={writingEntries} flushLast />
          <Button href="/writings">View all →</Button>
        </MotionReveal>
      </main>
    </>
  );
}
