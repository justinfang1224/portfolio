import { Tag } from "@/components/Tag";
import { ArrowUpRightIcon } from "@/components/icons";
import styles from "./AboutFavorites.module.css";

type FavoriteTravelCardProps = {
  href: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  location: string;
  title: string;
};

export function FavoriteTravelCard({
  href,
  imageAlt,
  imageSrc,
  label,
  location,
  title
}: FavoriteTravelCardProps) {
  return (
    <article className={`${styles.card} ${styles.smallCard} ${styles.travelCard}`}>
      <Tag>{label}</Tag>
      <a
        aria-label={`Open ${title} in Maps`}
        className={styles.travelLink}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <img alt={imageAlt} className={styles.travelImage} src={imageSrc} />
        <span className={styles.travelCopy}>
          <span>{title}</span>
          <span>{location}</span>
        </span>
      </a>
      <a
        aria-label={`Open ${title} in Maps`}
        className={styles.arrowLink}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ArrowUpRightIcon aria-hidden="true" className={styles.arrowIcon} />
      </a>
    </article>
  );
}
