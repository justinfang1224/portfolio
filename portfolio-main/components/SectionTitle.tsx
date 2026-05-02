import styles from "./SectionTitle.module.css";

type SectionTitleProps = {
  id?: string;
  index: string;
  title: string;
};

export function SectionTitle({ id, index, title }: SectionTitleProps) {
  return (
    <div className={styles.sectionTitle}>
      <p className={styles.index}>{index}</p>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
    </div>
  );
}
