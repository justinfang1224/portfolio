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
  "0": 0,
  "4": 4,
  "8": 8,
  "12": 12,
  "16": 16,
  "20": 20,
  "24": 24,
  "36": 36,
  "40": 40,
  "48": 48,
  "56": 56,
  "64": 64,
  "80": 80,
  "100": 100,
  "128": 128,
  "190": 190,
  "201": 201,
} as const;

export const color = {
  "border-primary": "#EDEDED",
  "border-secondary": "#F0F0F0",
  "content-primary": "#111111",
  "content-secondary": "#737373",
  "content-tertiary": "#B3B3B3",
  "content-contrast": "#F9F9F7",
  "background-primary": "#F7F7F7",
  "background-secondary": "#F0F0F0",
  "background-contrast": "#FFFFFF",
  "surface-card-primary": "#F7F7F7",
  "surface-card-secondary": "#F0F0F0",
  "button-secondary-default": "#F5F5F5",
  "button-secondary-hover": "#EEEEEE",
  "button-secondary-pressed": "#E0E0E0",
} as const;

export type TypographyTokenName = keyof typeof typography;
export type SpacingTokenName = keyof typeof spacing;
export type ColorTokenName = keyof typeof color;

export const buttonSecondaryState = { default: color["button-secondary-default"], hover: color["button-secondary-hover"], pressed: color["button-secondary-pressed"] } as const;
export const cardBackground = { primary: color["surface-card-primary"], secondary: color["surface-card-secondary"] } as const;

