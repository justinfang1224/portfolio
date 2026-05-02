import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Primitives/Badge",
  component: Badge,
  args: {
    children: "Status label",
    size: "s",
    status: "positive"
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "l"]
    },
    status: {
      control: "inline-radio",
      options: ["neutral", "positive", "warning"]
    }
  },
  parameters: {
    docs: {
      description: {
        component: "Status chip for project availability and contextual state."
      }
    }
  }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Badge status="neutral">Default</Badge>
      <Badge status="positive">Positive</Badge>
      <Badge status="warning">Warning</Badge>
      <Badge size="l" status="positive">
        Large label
      </Badge>
    </div>
  )
};
