# Portfolio Landing Implementation Checklist

Use this checklist while building the landing page from `PRD.md`.

## 1. Setup

- [ ] Create the landing app separately from `design-system-tokens/`.
- [ ] Use Next.js + React + TypeScript.
- [ ] Import generated token CSS from `design-system-tokens/src/tokens.css`.
- [ ] Do not edit generated token files from the landing app.
- [ ] Do not add Tailwind unless it is chosen as a deliberate project dependency later.

## Preview Stability

- Use `npm run dev:stable` when the portfolio preview disappears or shows stale errors.
- Canonical preview URL: `http://localhost:3003`.
- Recovery routine: stop the old preview if needed, run `npm run dev:stable`, then hard-refresh the browser tab.
- Keep `.next/`, `node_modules/`, and `*.tsbuildinfo` out of source control and file sync workflows.

## 2. Token Compliance

- [ ] Primary text uses `--color-content-primary`.
- [ ] Secondary text uses `--color-content-secondary`.
- [ ] Metadata uses `--color-content-tertiary`.
- [ ] Dividers use `--color-border-primary` or `--color-border-secondary`.
- [ ] Card/chip/project surfaces use `--color-surface-card-primary` or `--color-surface-card-secondary`.
- [ ] Secondary buttons use `--color-button-secondary-default`.
- [ ] Secondary button hover uses `--color-button-secondary-hover`.
- [ ] Secondary button active/pressed uses `--color-button-secondary-pressed`.
- [ ] No landing component contains hardcoded hex values.
- [ ] No landing component duplicates token values manually.
- [ ] Page background, active nav background, and translucent nav background are resolved through approved semantic tokens or documented local aliases.

## 3. Typography Compliance

- [ ] Base font family uses `--font-family-base`.
- [ ] Section titles use `heading-2` variables.
- [ ] Project titles/name use `heading-3` variables.
- [ ] Hero body uses `body-large` variables.
- [ ] Project body text uses `body-medium` variables.
- [ ] Buttons use `button` variables.
- [ ] Section indexes and metadata use `caption` variables.
- [ ] Raw Figma `Inter` references are converted to tokenized SF Pro styles unless explicitly approved.

## 4. Desktop Pixel Fidelity

- [ ] Verify at 1440px viewport.
- [ ] Main content shell is 960px wide and centered.
- [ ] Text column is 796px wide.
- [ ] Main content starts 172px from the top.
- [ ] Floating navigation is centered and starts 64px from the top.
- [ ] Project image cards are 960px by 528px on desktop.
- [ ] Project card radius is 24px.
- [ ] Footer is 960px wide and visually placed 80px from the bottom of the design composition.
- [ ] Screenshot comparison against Figma shows no visible drift.

## 5. 4px Spacing Audit

- [ ] Main section gap is 64px.
- [ ] Section content gap is 40px.
- [ ] Hero internal gap is 24px.
- [ ] Button row gap is 12px.
- [ ] Project list gap is 48px.
- [ ] Project image/text gap is normalized to 40px.
- [ ] Project title/body gap is 8px.
- [ ] Tag row gap is 8px.
- [ ] Tag padding is 8px by 4px.
- [ ] Button padding is 16px by 8px.
- [ ] Reading list item gap is 36px.
- [ ] Reading title gap is 20px.
- [ ] Footer right group gap is 36px.
- [ ] Any non-4px value is documented as a Figma fidelity exception.

## 6. Components

- [ ] `FloatingNav` uses semantic `nav` markup and icon aria labels.
- [ ] `HeroIntro` uses one clear top-level heading.
- [ ] `Button` supports default, hover, active, and focus-visible states.
- [ ] `ProjectCard` receives content from typed data.
- [ ] `Tag` uses card surface tokens.
- [ ] `WritingList` uses links/articles and divider tokens.
- [ ] `Footer` uses semantic footer markup and tokenized caption text.

## 7. Responsive QA

- [ ] 1440px desktop matches Figma exactly.
- [ ] 1024px tablet keeps hierarchy and centered shell.
- [ ] 768px layout remains readable without horizontal scroll.
- [ ] 390px mobile keeps the same content order.
- [ ] Mobile project cards keep radius and aspect ratio.
- [ ] Mobile button rows wrap cleanly if needed.
- [ ] Mobile footer stacks only when space requires it.
- [ ] Floating nav remains usable on mobile.

## 8. Accessibility QA

- [ ] Page uses `header`, `nav`, `main`, `section`, `article`, and `footer` appropriately.
- [ ] Heading hierarchy is logical.
- [ ] Icon-only controls have aria labels.
- [ ] Decorative images/icons use empty alt text.
- [ ] Informative project images have useful alt text.
- [ ] Keyboard tab order follows visual order.
- [ ] Focus-visible states are clearly visible.
- [ ] Interactive targets are at least 44px where practical.
- [ ] Text contrast meets WCAG AA.

## 9. Performance QA

- [ ] Project images have explicit dimensions or aspect ratios.
- [ ] Below-the-fold images lazy load.
- [ ] First meaningful image is prioritized only if it improves LCP.
- [ ] No unnecessary client-side JavaScript is introduced.
- [ ] Production Lighthouse Performance is 90+.
- [ ] LCP is below 2.5s.
- [ ] CLS is below 0.1.

## 10. Final Definition Of Done

- [ ] `npm run tokens:check` passes in `design-system-tokens/`.
- [ ] Any required token gap has either a token update or documented local alias.
- [ ] Landing page passes visual, responsive, accessibility, and performance checks.
- [ ] Implementation remains separate from the token package.
- [ ] PRD acceptance criteria are satisfied.
