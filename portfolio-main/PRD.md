# Portfolio Landing Page PRD

## 1. Overview

Build a personal portfolio landing page for Justin Fang based on the Figma design:
[Portfolio landing design](https://www.figma.com/design/moCWBt3E2beZH0GX6fGhOv/Test?node-id=278-5370&m=dev).

The implementation must match the Figma page exactly on desktop and preserve the same hierarchy, rhythm, and visual intent on mobile. The page is a high-signal portfolio landing page for a product designer working in fintech and web3. It should feel minimal, precise, fast, and editorial.

## 2. Product Goals

- Present Justin's identity, current role, featured project work, writings, and contact entry points in one polished landing page.
- Demonstrate craft through pixel-accurate execution, clean interaction states, strong performance, and accessible semantics.
- Keep the build scalable so future case studies, writings, navigation items, and token updates can be added without visual drift.
- Keep the landing implementation separate from the design token package.

## 3. Non-Goals

- Do not build full case study pages in this scope.
- Do not change the source design tokens unless a design-system correction is explicitly requested.
- Do not introduce a new visual language beyond the Figma design and `design-system-tokens/`.
- Do not install Tailwind only because the Figma export contains Tailwind-like classes. Convert Figma output into the selected app styling system.

## 4. Recommended Technical Stack

- Framework: Next.js + React + TypeScript.
- Styling: CSS Modules or colocated scoped CSS using token CSS variables.
- Assets: Next.js image optimization for raster project images and profile image.
- Data: Local typed content module for projects and writing entries.
- Token consumption: import generated CSS from `../design-system-tokens/src/tokens.css` or copy it through the app build pipeline.

## 5. Source Of Truth

### Figma

- File key: `moCWBt3E2beZH0GX6fGhOv`
- Node: `278:5370`
- Desktop design frame: 1440px wide.

### Design Tokens

The portfolio app must consume generated outputs from:

- `../design-system-tokens/tokens/source.json`
- `../design-system-tokens/src/tokens.css`
- `../design-system-tokens/src/tokens.ts`

Generated token files are read-only from the landing app perspective.

## 6. Page Information Architecture

The page contains the following sections, in order:

1. Floating top navigation
2. Hero / intro
3. Featured projects
4. Writings
5. Footer

Content order must remain the same across desktop, tablet, and mobile.

## 7. Desktop Layout Requirements

Desktop is the canonical design target.

| Area | Requirement |
| --- | --- |
| Page frame | 1440px design reference width |
| Page background | white; see token gap policy before implementation |
| Main content x-position | 240px from left on 1440px frame |
| Main content width | 960px |
| Text column width | 796px |
| Main content top offset | 172px |
| Main section gap | 64px |
| Footer bottom offset | 80px |
| Footer width | 960px |

Implementation may center the 960px content container with `margin-inline: auto` rather than hardcoding `left: 240px`; at 1440px viewport this must resolve to the same position.

## 8. 4px Spacing Rule

All spacing, sizing, and radius decisions must follow a 4px grid unless the Figma design requires a documented exception.

Required normalized values:

| Use | Value |
| --- | --- |
| Main content vertical gap | 64px |
| Section internal gap | 40px |
| Hero title block gap | 24px |
| Button group gap | 12px |
| Project list gap | 48px |
| Project card image/text gap | 40px |
| Project title/body gap | 8px |
| Project metadata gap | 12px |
| Tag/chip gap | 8px |
| Tag/chip padding | 8px horizontal, 4px vertical |
| Button padding | 16px horizontal, 8px vertical |
| Floating nav padding | 4px outer, 8px icon items |
| Reading list row metadata gap | 8px |
| Reading list item gap | 36px |
| Reading title section gap | 20px |
| Footer link gap | 36px |
| Project card radius | 24px |
| Button/chip/nav radius | 24px |

Figma-exported values such as `39px` and `19px` should be normalized to the nearest 4px-compliant value (`40px`, `20px`) unless visual QA proves the exact odd value is required.

## 9. Typography Requirements

Use the design system's SF Pro token scale. Raw Figma export references to `Inter` must be resolved back to the tokenized type system unless the Figma source is explicitly updated to require Inter.

| Figma role | Token | CSS variables |
| --- | --- | --- |
| H2 / section title | `heading-2` | `--typography-heading-2-*` |
| H3 / project title / name | `heading-3` | `--typography-heading-3-*` |
| Body large / hero body | `body-large` | `--typography-body-large-*` |
| Body medium / project summary | `body-medium` | `--typography-body-medium-*` |
| Button | `button` | `--typography-button-*` |
| Caption / section index / metadata | `caption` | `--typography-caption-*` |

### Text Content

Hero:

- Section index: `01`
- Name: `Justin Fang`
- Body: `Product designer in the field of financial technology. Currently designing web3.0 trading & asset management experience at @Crypto.com.`
- Updated text: `🪚 Updated Mar 25, 2026`
- Buttons: `Placeholder`, `CV →`

Projects:

- Section index: `02`
- Title: `Office hours   —   🕐  Clock in`
- Description: `Brief documentation of the featured projects. Detailed case study provide upon request.`
- Project 1 title: `Launching Crypto.com Credit Card`
- Project 1 description: `Building the 0 → 1 of a crypto-based credit card for the U.S market. Centralizing rewards within the experience, driving 3M+ card spend within the first 6 months.`
- Project 1 tags: `0 → 1`, `Payment`
- Project 2 title: `Optimizing OKX's deposit experience`
- Project 2 description: `Design enhancement that led to a 18.3% increase in conversion`
- Project 2 tags: `Feature improvement`, `Payment`
- Project 3 title: `An intuitive filter widget that improved insurance underwriter's effeciency`
- Project 3 description: `This design initiative introduces a "smart filter" feature-improving usability, reducing repetitive tasks, and enabling easy sharing across the team to streamline workflows and minimize mistakes.`
- Project 3 tags: `New feature`, `Internal tools`

Writings:

- Section index: `03`
- Title: `Writings ✍🏻`
- Item 1: `Workflow optimization within Figma at OKX`
- Item 2: `Reading "Living with complexity" by Don Norman`
- Item 3: `Ethnographic research at a local park in Hong Kong`
- Metadata date: `Posted on 08.09.2024`
- Categories: `Design practice`, `Reading`, `Research`
- CTA: `View all →`

Footer:

- `© 2026 All rights reserved @justinfang`
- `Hong Kong`
- `GMT+8`

Copy above reflects the Figma content, including current spelling and punctuation. Any copy corrections, such as `effeciency` or `Detailed case study provide`, should be treated as content changes and approved before implementation.

## 10. Color And Token Contract

No hardcoded hex values are allowed in landing components, except inside generated token files.

| Use | Token variable |
| --- | --- |
| Primary text | `--color-content-primary` |
| Secondary text | `--color-content-secondary` |
| Tertiary text / metadata | `--color-content-tertiary` |
| Light contrast text/icon | `--color-content-contrast` |
| Dividers | `--color-border-primary` or `--color-border-secondary` |
| Card and chip surface | `--color-surface-card-primary` |
| Alternate card surface | `--color-surface-card-secondary` |
| Secondary button default | `--color-button-secondary-default` |
| Secondary button hover | `--color-button-secondary-hover` |
| Secondary button pressed | `--color-button-secondary-pressed` |

Card-like surfaces, tags, chips, and project image backgrounds must prefer `surface.card.*` tokens over generic `background.*` tokens.

### Token Gap Policy

The current token package does not yet define every color semantic needed by the Figma page. Implementation must not silently hardcode these values. Resolve gaps in one of two ways before coding the final UI:

1. Add semantic tokens to `design-system-tokens/` in a separate token change.
2. Create local CSS aliases in the landing app that are documented in code and derived from existing tokens.

Known gaps:

| Figma use | Current value | Preferred resolution |
| --- | --- | --- |
| Page canvas background | white | Add `surface.page.primary` or local `--portfolio-page-background` |
| Active nav item | white | Add `surface.nav.active` or local `--portfolio-nav-active-background` |
| Floating nav translucent background | `rgba(247,247,247,0.8)` | Derive from `--color-surface-card-primary` with alpha/color-mix |

## 11. Component Requirements

### Floating Navigation

- Position: fixed near top center.
- Desktop top offset: 64px.
- Container: blurred translucent pill, 4px padding, 24px radius.
- Active item: white pill with 12px horizontal and 8px vertical padding.
- Inactive items: 8px padding.
- Icon size: 20px.
- Required nav items: home, work/projects, writing/document, contact/message.
- Must support keyboard focus and aria labels.

### Hero

- Container width: 796px within the 960px page shell.
- Top starts at 172px on desktop.
- Section index uses caption token and secondary content color.
- Avatar: 64px square/circle.
- Hero copy width: 671px on desktop.
- CTA row gap: 12px.
- Buttons use secondary button tokens for default, hover, pressed, and focus-visible states.

### Featured Projects

- Section text column: 796px.
- Project image card width: 960px.
- Project image card height: 528px.
- Project image radius: 24px.
- Project list gap: 48px.
- Project image/text group gap: normalize to 40px.
- Metadata tags use card surface tokens, 8px x 4px padding, 24px radius.
- Image treatment must match Figma cropping. Use `object-fit: cover` and explicit positioning where needed.

### Writings

- Section width: 796px.
- Section title gap: 20px.
- List item layout: text block plus trailing arrow icon.
- Item title uses subtitle or heading-3 depending on visual match; final implementation must match Figma's 18px/28px appearance.
- Metadata uses caption token and tertiary content color.
- Divider uses border token and spans full 796px width.
- CTA button uses secondary button tokens.

### Footer

- Width: 960px.
- Desktop bottom offset: 80px.
- Layout: copyright left, location/time group right.
- Text uses caption token and tertiary content color.
- Right group gap: 36px.

## 12. Responsive Requirements

Desktop remains the source of truth. Mobile should preserve the same content order and general visual layout, not become a completely different experience.

Recommended breakpoints:

| Breakpoint | Behavior |
| --- | --- |
| >= 1200px | Exact desktop layout, 960px shell, 796px text column |
| 768px-1199px | Fluid shell with 32px side gutters, text column max 796px |
| < 768px | Single-column mobile, 20px side gutters, same section order |

Mobile rules:

- Floating nav remains centered and fixed/sticky at top.
- Main content top offset can reduce from 172px to 128px if needed.
- Content shell width becomes `calc(100vw - 40px)`.
- Text column fills shell width.
- Project cards keep 24px radius and 16:9-ish visual proportion; use `aspect-ratio` rather than fixed 528px height.
- Footer stacks only if the 960px two-column layout cannot fit.
- Button groups may wrap, but order must remain the same.
- Reading list trailing arrow remains visible and right-aligned.

## 13. Interaction Requirements

- Buttons:
  - Default: `--color-button-secondary-default`
  - Hover: `--color-button-secondary-hover`
  - Pressed/active: `--color-button-secondary-pressed`
  - Focus visible: visible outline using content or border token, at least 2px offset.
- Links:
  - Must be keyboard focusable.
  - External links open in a new tab only where intentional.
  - Underline treatment for `@Crypto.com` must match Figma's dotted underline.
- Nav:
  - Active item state must be visually distinct.
  - All icon-only controls require `aria-label`.

## 14. Accessibility Requirements

- Use semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Use a single `h1` for the person's name or portfolio intro.
- Use ordered heading hierarchy for projects and writings.
- Decorative icons/images must use empty alt text.
- Project images must have meaningful alt text if they communicate content.
- Minimum interactive target: 44px where practical; if visual size is smaller, clickable area must meet target.
- Text contrast must meet WCAG AA for normal text.
- Page must be usable with keyboard only.

## 15. Performance Requirements

- Lighthouse Performance target: 90+ on production build.
- Largest Contentful Paint target: under 2.5s on a typical portfolio landing load.
- Cumulative Layout Shift target: under 0.1.
- Project images must use explicit dimensions or aspect ratios.
- Above-the-fold profile and first project image should be prioritized carefully; below-the-fold project images should lazy load.
- Avoid large client-side JavaScript for static content.

## 16. Engineering Architecture

Recommended folder split:

```text
design-system-tokens/
  tokens/source.json
  src/tokens.css
  src/tokens.ts

portfolio-landing/
  PRD.md
  implementation-checklist.md
  app-or-src/
    content/
    components/
    styles/
    assets/
```

The landing app must not edit `design-system-tokens/` during normal feature work. Token changes require separate review.

Recommended component model:

- `FloatingNav`
- `HeroIntro`
- `Button`
- `SectionTitle`
- `ProjectCard`
- `Tag`
- `WritingList`
- `Footer`

Recommended content model:

- `projects[]` with title, description, tags, image, alt, href.
- `writings[]` with title, date, category, href.
- `profile` with name, intro, update date, location/time display.

## 17. Quality Gates

Implementation is complete only when all gates pass:

- Figma desktop visual match verified at 1440px width.
- All spacing values are multiples of 4px or documented exceptions.
- No hardcoded hex values in landing components.
- No arbitrary typography values outside token usage unless documented and approved.
- `npm run tokens:check` passes inside `design-system-tokens/`.
- Responsive checks pass at 1440px, 1024px, 768px, 390px.
- Keyboard navigation works through nav, hero CTAs, writing links, and footer links.
- Lighthouse or equivalent audit meets performance/accessibility targets.

## 18. Acceptance Criteria

- The desktop page visually matches the Figma screenshot and node specs with no obvious spacing, sizing, typography, or color drift.
- The implementation uses Next.js, React, and TypeScript conventions.
- All visual styling consumes generated token CSS variables or documented semantic aliases.
- The landing implementation is isolated from the token package.
- Mobile layout keeps the same content order and mostly the same visual composition.
- Secondary button states use the exact tokenized default, hover, and pressed colors.
- Card, chip, and project surfaces use `surface.card.*` tokens.
- The PRD and checklist are stored separately from `design-system-tokens/`.
