import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { MotionReveal } from "@/components/MotionReveal";
import { UpdatedAtTypewriter } from "@/components/UpdatedAtTypewriter";
import { ArrowUpRightIcon } from "@/components/icons";
import { profile, writings } from "@/content/portfolio";
import { HomeFeaturedCarousel } from "./HomeFeaturedCarousel";
import styles from "./page.module.css";
import { ProfileAvatarToggle } from "./ProfileAvatarToggle";

function CompanyLink({
  company
}: {
  company: {
    href: string;
    label: string;
    logoAlt: string;
    logoSrc: string;
  };
}) {
  return (
    <a className={styles.companyLink} href={company.href} rel="noreferrer" target="_blank">
      <Image
        alt={company.logoAlt}
        className={styles.companyLogo}
        height={16}
        sizes="16px"
        src={company.logoSrc}
        width={16}
      />
      <span>{company.label}</span>
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
      <FloatingNav />
      <main className={styles.main}>
        <MotionReveal as="section" aria-labelledby="home-title" className={styles.hero}>
          <p className={styles.index}>{profile.sectionIndex}</p>
          <div className={styles.identityRow}>
            <ProfileAvatarToggle />
            <div className={styles.identityCopy}>
              <h1 className={styles.name} id="home-title">
                {profile.name}
              </h1>
              <p>Senior Product Designer</p>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal as="section" aria-label="Introduction" className={styles.introSection}>
          <UpdatedAtTypewriter value="📌 Updated on July 1, 2026" />
          <div className={styles.prose}>
            <p>
              I&apos;m a Product designer in the field of financial technology. In the past two
              years, I&apos;ve designed web3.0 trading experience for{" "}
              <CompanyLink company={profile.introCompany} />. Specifically building in the domain
              of{" "}
              <span className={styles.underlined}>credit card</span>,{" "}
              <span className={styles.underlined}>platform AI</span>, and{" "}
              <span className={styles.underlined}>prediction markets</span> in a highly
              fast-paced environment.
            </p>
            <p>
              Before that I was a designer (at){" "}
              {profile.introPreviousCompanies.map((company, index) => (
                <span key={company.href}>
                  <CompanyLink company={company} />
                  {index < profile.introPreviousCompanies.length - 1 ? " & " : null}
                </span>
              ))}
              .
            </p>
            <p>
              I consider myself a designer at heart and enjoy building products with taste. Very
              recently, I start shipping things myself with the assistance of code & AI, including
              this site, you are looking at <span className={styles.version}>v.7.2.0</span>.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal as="section" aria-labelledby="featured-work-title" className={styles.workSection} id="projects">
          <p className={styles.workEyebrow} id="featured-work-title">
            🌐 Peek into my recent work ↓
          </p>
          <HomeFeaturedCarousel />
          <Button href="/projects">View work →</Button>
        </MotionReveal>

        <MotionReveal as="section" aria-labelledby="writings-title" className={styles.writings} id="writings">
          <div className={styles.sectionHeader}>
            <p className={styles.index}>02</p>
            <h2 id="writings-title">Writings</h2>
          </div>
          <div className={styles.writingList}>
            {writingEntries.map((writing, index) => (
              <article className={styles.writingItem} key={writing.title}>
                <Link className={styles.writingLink} href={writing.href}>
                  <div className={styles.writingCopy}>
                    <h3>{writing.title}</h3>
                    <p>
                      <span>{index === 1 ? "Posted on 08.09.2024" : writing.date}</span>
                      <span aria-hidden="true">•</span>
                      <span>{writing.category}</span>
                    </p>
                  </div>
                  <ArrowUpRightIcon aria-hidden="true" className={styles.writingArrow} />
                </Link>
              </article>
            ))}
          </div>
          <Button href="/writings">View all →</Button>
        </MotionReveal>
      </main>
      <Footer />
    </>
  );
}
