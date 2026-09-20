import type { Meta, StoryObj } from "@storybook/react";
import { TermExplain } from "./TermExplain";

const meta = {
  title: "Components/Primitives/TermExplain",
  component: TermExplain,
  args: {
    children: "Crypto.com",
    explanation: "A global multi-asset trading platform"
  },
  parameters: {
    docs: {
      description: {
        component:
          "Inline terminology hint. On hover or focus, a dashed caption chip slides up with a light bounce; on leave it mirrors that motion downward."
      }
    }
  }
} satisfies Meta<typeof TermExplain>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InProse: Story = {
  render: () => (
    <p
      style={{
        color: "var(--color-content-primary)",
        fontFamily: "var(--font-family-base)",
        fontSize: "var(--typography-body-medium-font-size)",
        lineHeight: "var(--typography-body-medium-line-height)",
        margin: 0,
        maxWidth: 520
      }}
    >
      I&apos;ve designed web3.0 trading experience for{" "}
      <TermExplain explanation="A global multi-asset trading platform">Crypto.com</TermExplain>.
      Specifically building in the domain of credit card, platform AI, and{" "}
      <TermExplain explanation="Markets where you trade on the outcome of real-world events">
        prediction markets
      </TermExplain>
      .
    </p>
  )
};

export const OnCompanyLink: Story = {
  render: () => (
    <p
      style={{
        color: "var(--color-content-primary)",
        fontFamily: "var(--font-family-base)",
        fontSize: "var(--typography-body-medium-font-size)",
        lineHeight: "var(--typography-body-medium-line-height)",
        margin: 0
      }}
    >
      Designed trading experience for{" "}
      <TermExplain asChild explanation="A global multi-asset trading platform">
        <a
          href="https://crypto.com"
          rel="noreferrer"
          style={{ color: "inherit", textDecoration: "underline", textDecorationStyle: "dotted" }}
          target="_blank"
        >
          Crypto.com
        </a>
      </TermExplain>
      .
    </p>
  )
};
