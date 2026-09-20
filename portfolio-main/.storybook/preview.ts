import type { Preview } from "@storybook/react";
import { createElement, useEffect, type MouseEvent, type ReactNode } from "react";
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

function ThemeRoot({ children, theme }: { children: ReactNode; theme: string }) {
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }

    return () => {
      root.removeAttribute("data-theme");
    };
  }, [theme]);

  return children;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "system", title: "System" }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    theme: "system"
  },
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
    (Story, context) =>
      createElement(
        ThemeRoot,
        { theme: String(context.globals.theme ?? "system") },
        createElement(
          "main",
          {
            className: "storybook-portfolio-shell",
            onClickCapture: preventStoryNavigation
          },
          createElement(Story)
        )
      )
  ],
  tags: ["autodocs"]
};

export default preview;
