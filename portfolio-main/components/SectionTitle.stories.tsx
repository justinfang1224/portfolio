import type { Meta, StoryObj } from "@storybook/react";
import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Components/Primitives/SectionTitle",
  component: SectionTitle,
  args: {
    index: "01",
    title: "Section title"
  },
  parameters: {
    docs: {
      description: {
        component: "Numbered section heading pattern used across portfolio pages."
      }
    }
  }
} satisfies Meta<typeof SectionTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    index: "03",
    title: "Long placeholder section title"
  }
};
