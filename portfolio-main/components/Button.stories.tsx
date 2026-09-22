import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Primitives/Button",
  component: Button,
  args: {
    children: "Action label",
    size: "m",
    variant: "secondary"
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["m", "s"]
    },
    variant: {
      control: "inline-radio",
      options: ["secondary", "text"]
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Secondary pill and text actions in medium and small sizes. Pill buttons scale to 1.02 on hover and 0.98 on press. Text buttons only change color."
      }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    children: "Placeholder",
    size: "s"
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      <Button>Placeholder</Button>
      <Button size="s">Placeholder</Button>
    </div>
  )
};

export const Text: Story = {
  args: {
    children: "Dark",
    variant: "text"
  }
};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      <Button>Primary action</Button>
      <Button size="s">Small action</Button>
      <Button variant="text">Text action</Button>
    </div>
  )
};
