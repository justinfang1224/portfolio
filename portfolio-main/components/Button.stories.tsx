import type { Meta, StoryObj } from "@storybook/react";
import { SettingsIcon } from "./icons";
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
      options: ["m", "s", "icon"]
    },
    variant: {
      control: "inline-radio",
      options: ["secondary", "text", "outline"]
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Secondary pill, outline, and text actions in medium, small, and icon sizes. Pill and outline buttons scale to 1.02 on hover and 0.98 on press. Text buttons only change color. Every press plays the Bencho off tone."
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

export const Icon: Story = {
  args: {
    "aria-label": "Settings",
    children: <SettingsIcon aria-hidden="true" strokeWidth={1.8} />,
    size: "icon"
  }
};

export const Text: Story = {
  args: {
    children: "Dark",
    variant: "text"
  }
};

export const Outline: Story = {
  args: {
    "aria-label": "Open menu",
    children: <SettingsIcon aria-hidden="true" height={18} strokeWidth={1.75} width={18} />,
    variant: "outline"
  }
};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
      <Button>Primary action</Button>
      <Button size="s">Small action</Button>
      <Button variant="outline" aria-label="Open menu">
        <SettingsIcon aria-hidden="true" height={18} strokeWidth={1.75} width={18} />
      </Button>
      <Button variant="text">Text action</Button>
    </div>
  )
};
