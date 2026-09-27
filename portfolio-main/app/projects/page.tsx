import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsIndex } from "./ProjectsIndex";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects - Justin Fang",
  description: "Selected product design case studies and project documentation by Justin Fang."
};

export default function ProjectsPage() {
  return (
    <>
      <Suspense fallback={<div aria-hidden="true" className={styles.routeFallback} />}>
        <ProjectsIndex />
      </Suspense>
    </>
  );
}
