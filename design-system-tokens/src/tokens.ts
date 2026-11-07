/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
 * Source: tokens/source.json
 * Run: npm run tokens:build
 */

export const meta = {
  name: "Portfolio Design Tokens",
  version: "1.0.0",
  fontFamily: "\"SF Pro Text\", \"SF Pro Display\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
} as const;

export const typography = {
  "heading-1": {
    size: 40,
    weight: 500,
    lineHeight: 48
  },
  "heading-2": {
    size: 28,
    weight: 500,
    lineHeight: 36
  },
  "heading-3": {
    size: 20,
    weight: 500,
    lineHeight: 28
  },
  "subtitle": {
    size: 18,
    weight: 400,
    lineHeight: 28
  },
  "subtitle-2": {
    size: 16,
    weight: 500,
    lineHeight: 27
  },
  "button": {
    size: 15,
    weight: 500,
    lineHeight: 18
  },
  "body-large": {
    size: 18,
    weight: 400,
    lineHeight: 30
  },
  "body-medium": {
    size: 16,
    weight: 400,
    lineHeight: 27
  },
  "body-small": {
    size: 14,
    weight: 400,
    lineHeight: 20
  },
  "caption": {
    size: 12,
    weight: 400,
    lineHeight: 16
  },
} as const;

export const spacing = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "6": 24,
  "8": 32,
  "9": 36,
  "10": 40,
  "12": 48,
  "20": 80,
  "25": 100,
  "32": 128,
  "page-top": 158,
} as const;

export const radius = {
  "xs": 2,
  "sm": 4,
  "md": 8,
  "lg": 12,
  "xl": 24,
  "full": 9999,
} as const;

export const motion = {
  "ease-smooth": "cubic-bezier(0.22, 1, 0.36, 1)",
  "duration-fast": 150,
  "duration-normal": 200,
  "duration-slow": 300,
} as const;

export const colorPrimitive = {
  "gray-0": "#ffffff",
  "gray-50": "#fafafa",
  "gray-100": "#f4f4f5",
  "gray-200": "#e4e4e7",
  "gray-400": "#a1a1aa",
  "gray-500": "#71717a",
  "gray-700": "#3f3f46",
  "gray-800": "#27272a",
  "gray-900": "#18181b",
  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-700": "#1d4ed8",
  "blue-900": "#1e3a8a",
  "green-50": "#f0fdf4",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-700": "#15803d",
  "green-900": "#14532d",
  "amber-50": "#fffbeb",
  "amber-100": "#fef3c7",
  "amber-200": "#fde68a",
  "amber-400": "#fbbf24",
  "amber-500": "#f59e0b",
  "amber-700": "#b45309",
  "amber-900": "#78350f",
  "red-50": "#fef2f2",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-700": "#b91c1c",
  "red-900": "#7f1d1d",
} as const;

export const color = {
  "border-primary": "#e4e4e7",
  "border-secondary": "#f4f4f5",
  "content-primary": "#18181b",
  "content-secondary": "#71717a",
  "content-tertiary": "#a1a1aa",
  "content-contrast": "#fafafa",
  "background-primary": "#fafafa",
  "background-secondary": "#f4f4f5",
  "background-contrast": "#ffffff",
  "surface-card-primary": "#fafafa",
  "surface-card-secondary": "#f4f4f5",
  "status-positive": "#22c55e",
  "status-warning": "#f59e0b",
  "button-secondary-default": "#f4f4f5",
  "button-secondary-hover": "#e4e4e7",
  "button-secondary-pressed": "#e4e4e7",
} as const;

export const colorDark = {
  "border-primary": "#3f3f46",
  "border-secondary": "#3f3f46",
  "content-primary": "#fafafa",
  "content-secondary": "#a1a1aa",
  "content-tertiary": "#71717a",
  "content-contrast": "#18181b",
  "background-primary": "#18181b",
  "background-secondary": "#3f3f46",
  "background-contrast": "#18181b",
  "surface-card-primary": "#18181b",
  "surface-card-secondary": "#3f3f46",
  "status-positive": "#22c55e",
  "status-warning": "#f59e0b",
  "button-secondary-default": "#27272a",
  "button-secondary-hover": "#3f3f46",
  "button-secondary-pressed": "#3f3f46",
} as const;

export type TypographyTokenName = keyof typeof typography;
export type SpacingTokenName = keyof typeof spacing;
export type RadiusTokenName = keyof typeof radius;
export type MotionTokenName = keyof typeof motion;
export type ColorPrimitiveName = keyof typeof colorPrimitive;
export type ColorTokenName = keyof typeof color;

export const buttonSecondaryState = { default: color["button-secondary-default"], hover: color["button-secondary-hover"], pressed: color["button-secondary-pressed"] } as const;
export const cardBackground = { primary: color["surface-card-primary"], secondary: color["surface-card-secondary"] } as const;

