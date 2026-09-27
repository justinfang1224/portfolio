import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";
import styles from "./Footer.stories.module.css";

const meta = {
  title: "Components/Navigation/Footer",
  component: Footer,
  parameters: {
    docs: {
      description: {
        component:
          "Site-wide footer with copyright and Hong Kong time. Mounted once from the root layout."
      }
    }
  }
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.preview}>
      <Footer />
    </div>
  )
};
