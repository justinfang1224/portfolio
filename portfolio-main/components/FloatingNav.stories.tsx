import type { Meta, StoryObj } from "@storybook/react";
import { FloatingNav } from "./FloatingNav";
import styles from "./FloatingNav.stories.module.css";

const meta = {
  title: "Components/Navigation/FloatingNav",
  component: FloatingNav,
  parameters: {
    docs: {
      description: {
        component:
          "Column-width header. The outline menu button stays at the left and spreads into Home, Projects, Writings, and About. Away from the home page, a matching back button eases in beside it and returns to the previous page. The theme switch sits on the right."
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
