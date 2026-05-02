import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";
import { MotionReveal } from "./MotionReveal";
import { Tag } from "./Tag";
import styles from "./ProjectCard.module.css";

export type ProjectCardProject = {
  alt: string;
  description: string;
  detailHref: string | null;
  image: string;
  imageClassName: "projectImagePhone" | "projectImageBrowser" | "projectImageFilter";
  status: "active" | "locked";
  tags: readonly string[];
  title: string;
};

type ProjectCardProps = {
  delay?: number;
  project: ProjectCardProject;
};

export function ProjectCard({ delay = 0, project }: ProjectCardProps) {
  const statusLabel = project.status === "active" ? "Active" : "Locked";
  const statusTone = project.status === "active" ? "positive" : "warning";
  const mediaContent = (
    <>
      <Badge className={styles.statusBadge} size="s" status={statusTone}>
        {statusLabel}
      </Badge>
      <Image
        alt={project.alt}
        className={`${styles.image} ${styles[project.imageClassName]}`}
        height={528}
        sizes="(max-width: 767px) 100vw, 960px"
        src={project.image}
        width={960}
      />
    </>
  );

  return (
    <MotionReveal as="article" className={styles.card} delay={delay}>
      {project.detailHref ? (
        <Link
          aria-label={`Open case study: ${project.title}`}
          className={`${styles.media} ${styles.mediaLink}`}
          href={project.detailHref}
        >
          {mediaContent}
        </Link>
      ) : (
        <div className={styles.media}>{mediaContent}</div>
      )}
      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.description}>{project.description}</p>
        </div>
        <div className={styles.tags} aria-label={`${project.title} categories`}>
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </MotionReveal>
  );
}
