import type { Metadata } from "next";
import { Suspense } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { ProjectsIndex } from "./ProjectsIndex";

export const metadata: Metadata = {
  title: "Projects - Justin Fang",
  description: "Selected product design case studies and project documentation by Justin Fang."
};

export default function ProjectsPage() {
  return (
    <>
      <FloatingNav />
      <Suspense fallback={null}>
        <ProjectsIndex />
      </Suspense>
      <Footer />
    </>
  );
}
