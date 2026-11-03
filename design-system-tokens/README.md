# Design System Tokens

Scalable design token package for a portfolio project.  
This folder keeps a **single source of truth** for typography and color values, then generates consumable outputs for apps.

## Why this structure

- Keeps design values centralized in `tokens/source.json`
- Generates platform-ready files (`src/tokens.css`, `src/tokens.ts`)
- Prevents drift with `npm run tokens:check` in CI or pre-commit workflows

## Token coverage

Primitives are the raw values. Semantic tokens point at primitives.

- Color primitives: gray, blue, green, amber, and red scales
- Color semantics (light and dark):
  - Border: primary, secondary
  - Content: primary, secondary, tertiary, contrast
  - Background: primary, secondary, contrast
  - Surface card: primary, secondary
  - Status: positive (`green-500`), warning (`amber-500`)
  - Button secondary states: default, hover, pressed
- Spacing primitives: `space-1` through `space-12` (4, 8, 12, 16, 24, 32, 48)
- Radius primitives: `sm` 4, `md` 8, `lg` 12, `full` 9999
- Motion primitives: `ease-smooth`, `duration-fast` 150, `duration-normal` 200, `duration-slow` 300
- Motion semantics: fade and theme, both `duration-slow` and `ease-smooth`
- Typography (SF Pro scale)

Blue, red, and the unused green and amber stops are primitives only. They have no semantic names.

## Commands

- `npm run tokens:build` - Generate `src/tokens.css` and `src/tokens.ts` from `tokens/source.json`
- `npm run tokens:check` - Verify generated outputs are up-to-date with source values

## How to use in a portfolio app

1. Import `src/tokens.css` once at app root.
2. Use semantic CSS variables for styling (`var(--color-content-primary)`). Reach for a primitive (`var(--gray-900)`, `var(--space-4)`, `var(--radius-lg)`, `var(--duration-fast)`) only when no semantic token exists.
3. For card UI, prefer `var(--color-surface-card-primary)` and `var(--color-surface-card-secondary)`.
4. Secondary button background states should always use:
   - `--color-button-secondary-default`
   - `--color-button-secondary-hover`
   - `--color-button-secondary-pressed`
5. Reuse TypeScript tokens from `src/tokens.ts` where JS/TS values are needed.
6. Do not edit generated files directly; edit `tokens/source.json` and regenerate.

## Best-practice workflow

- Designers update values -> update `tokens/source.json`
- Run `npm run tokens:build`
- Commit both source and generated files
- CI runs `npm run tokens:check` to block stale tokens
