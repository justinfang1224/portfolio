import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)", "../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag"
  },
  async viteFinal(config) {
    const allow = new Set(config.server?.fs?.allow ?? []);
    allow.add(path.resolve(storybookDir, "../.."));
    config.server ??= {};
    config.server.fs ??= {};
    config.server.fs.allow = [...allow];
    return config;
  }
};

export default config;
