import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { HeroIntro } from "@/components/HeroIntro";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionTitle } from "@/components/SectionTitle";
import { WritingList } from "@/components/WritingList";
import { projects } from "@/content/portfolio";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main className={styles.main}>
        <HeroIntro />
        <section aria-labelledby="projects-title" className={styles.projects} id="projects">
          <MotionReveal className={styles.projectIntro}>
            <SectionTitle id="projects-title" index="02" title="Office hours   —   🕐  Clock in" />
            <p className={styles.projectDescription}>
              Brief documentation of the featured projects. Detailed case study provide upon request.
            </p>
          </MotionReveal>
          <div className={styles.projectList}>
            {projects.map((project, index) => (
              <ProjectCard
                delay={Math.min(index, 2) * 60}
                key={project.title}
                project={project}
              />
            ))}
          </div>
        </section>
        <WritingList />
      </main>
      <Footer />
    </>
  );
}
