import type { Meta, StoryObj } from "@storybook/react";
import { assetUrls } from "@/content/portfolio";
import { ProjectCard, type ProjectCardProject } from "./ProjectCard";

const placeholderProjects = {
  active: {
    title: "Project title",
    description:
      "Short placeholder description that explains the project outcome and gives the card enough text to show spacing.",
    tags: ["Label one", "Label two"],
    image: assetUrls.projectCard,
    alt: "Placeholder project preview image.",
    imageClassName: "projectImagePhone",
    detailHref: null,
    status: "active"
  },
  locked: {
    title: "Secondary project title",
    description: "Concise placeholder copy for a second card state.",
    tags: ["Label three", "Label four"],
    image: assetUrls.depositExperience,
    alt: "Placeholder interface preview image.",
    imageClassName: "projectImageBrowser",
    detailHref: null,
    status: "locked"
  }
} satisfies Record<string, ProjectCardProject>;

const meta = {
  title: "Components/Content/ProjectCard",
  component: ProjectCard,
  args: {
    project: placeholderProjects.active
  },
  parameters: {
    docs: {
      description: {
        component: "Featured project card with media, status badge, descriptive copy, and metadata tags."
      }
    }
  }
} satisfies Meta<typeof ProjectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondaryState: Story = {
  args: {
    project: placeholderProjects.locked
  }
};
