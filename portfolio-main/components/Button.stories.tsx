import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Primitives/Button",
  component: Button,
  args: {
    children: "Action label"
  },
  parameters: {
    docs: {
      description: {
        component: "Secondary pill action used throughout the portfolio."
      }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button>Primary action</Button>
      <Button>Secondary action</Button>
      <Button>Tertiary action</Button>
    </div>
  )
};
