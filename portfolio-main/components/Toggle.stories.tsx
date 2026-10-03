import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "./Toggle";

const meta = {
  title: "Components/Primitives/Toggle",
  component: Toggle,
  args: {
    "aria-label": "Dark mode",
    checked: false
  },
  parameters: {
    docs: {
      description: {
        component:
          "48×24 switch. The track and thumb use design-system colors. The thumb still stretches as it moves, with stretch 40 and speed 100."
      }
    }
  }
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: {
    onChange: () => undefined
  }
};

export const On: Story = {
  args: {
    checked: true,
    onChange: () => undefined
  }
};

export const Interactive: Story = {
  args: {
    onChange: () => undefined
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);

    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  }
};
