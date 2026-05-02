import Image from "next/image";
import { assetUrls, profile } from "@/content/portfolio";
import { Button } from "./Button";
import styles from "./HeroIntro.module.css";
import { MotionReveal } from "./MotionReveal";
import { UpdatedAtTypewriter } from "./UpdatedAtTypewriter";

type HeroCompanyLinkProps = {
  company: {
    href: string;
    label: string;
    logoAlt: string;
    logoSrc: string;
  };
};

function HeroCompanyLink({ company }: HeroCompanyLinkProps) {
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

export function HeroIntro() {
  return (
    <MotionReveal as="section" aria-labelledby="hero-title" className={styles.hero} id="home">
      <div className={styles.identity}>
        <p className={styles.index}>{profile.sectionIndex}</p>
        <Image
          alt=""
          className={styles.avatar}
          height={64}
          priority
          sizes="64px"
          src={assetUrls.avatar}
          width={64}
        />
        <h1 className={styles.name} id="hero-title">
          {profile.name}
        </h1>
        <div className={styles.copyGroup}>
          <div className={styles.intro}>
            <p>
              {profile.introPrefix}
              <span>{profile.introHighlight}</span>
              {profile.introMiddle}
              <HeroCompanyLink company={profile.introCompany} />
              .
            </p>
            <p>
              {profile.introPreviousPrefix}
              {profile.introPreviousCompanies.map((company, index) => (
                <span key={company.href}>
                  <HeroCompanyLink company={company} />
                  {index < profile.introPreviousCompanies.length - 1 ? " & " : null}
                </span>
              ))}
            </p>
          </div>
          <UpdatedAtTypewriter value={profile.updatedAt} />
        </div>
      </div>
      <div className={styles.actions} aria-label="Hero actions">
        {profile.ctas.map((cta) => (
          <Button href={cta.href} key={cta.label} openInNewTab={cta.openInNewTab}>
            {cta.label}
          </Button>
        ))}
      </div>
    </MotionReveal>
  );
}
