import type { Preview } from "@storybook/react";
import { createElement, type MouseEvent } from "react";
import "../app/globals.css";
import "./preview.css";

function preventStoryNavigation(event: MouseEvent<HTMLElement>) {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const link = target.closest("a");

  if (!link) {
    return;
  }

  event.preventDefault();
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "fullscreen",
    nextjs: {
      appDirectory: true
    },
    backgrounds: {
      default: "portfolio",
      values: [
        {
          name: "portfolio",
          value: "var(--portfolio-page-background)"
        },
        {
          name: "surface",
          value: "var(--color-surface-card-primary)"
        }
      ]
    }
  },
  decorators: [
    (Story) =>
      createElement(
        "main",
        {
          className: "storybook-portfolio-shell",
          onClickCapture: preventStoryNavigation
        },
        createElement(Story)
      )
  ],
  tags: ["autodocs"]
};

export default preview;
