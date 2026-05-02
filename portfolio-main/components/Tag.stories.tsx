import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";

const meta = {
  title: "Components/Primitives/Tag",
  component: Tag,
  args: {
    children: "Label"
  },
  parameters: {
    docs: {
      description: {
        component: "Small metadata chip used for project categories."
      }
    }
  }
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Contrast: Story = {
  args: {
    children: "Bookstore",
    variant: "contrast"
  }
};

export const Group: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Tag>Label one</Tag>
      <Tag>Label two</Tag>
      <Tag variant="contrast">Contrast label</Tag>
      <Tag>Label four</Tag>
    </div>
  )
};
