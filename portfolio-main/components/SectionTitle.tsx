import styles from "./SectionTitle.module.css";
import { dsMarker } from "@/lib/ds-marker";

type SectionTitleProps = {
  id?: string;
  index: string;
  title: string;
};

export function SectionTitle({ id, index, title }: SectionTitleProps) {
  return (
    <div className={styles.sectionTitle} {...dsMarker("SectionTitle")}>
      <p className={styles.index}>{index}</p>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
    </div>
  );
}
