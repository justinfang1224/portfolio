import type { Meta, StoryObj } from "@storybook/react";
import { FloatingNav } from "./FloatingNav";
import styles from "./FloatingNav.stories.module.css";

const meta = {
  title: "Components/Navigation/FloatingNav",
  component: FloatingNav,
  parameters: {
    docs: {
      description: {
        component: "Primary portfolio navigation with a blurred pill container and active indicator."
      }
    }
  }
} satisfies Meta<typeof FloatingNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.preview}>
      <FloatingNav />
    </div>
  )
};
