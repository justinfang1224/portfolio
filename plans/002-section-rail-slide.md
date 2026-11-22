# 002 — Slide the section-rail pill straight to the next item

- **Status**: DONE
- **Commit**: 41d7bd6
- **Severity**: HIGH
- **Category**: Missed opportunity (state change that teleports), easing & duration, interruptibility
- **Estimated scope**: 4 files (token source + generated tokens, `ProjectSectionRail.tsx`, `ProjectSectionRail.module.css`)

## Problem

On project detail pages the section rail paints the selected label by swapping classes. `portfolio-main/components/projects/ProjectSectionRail.tsx:83-98` sets `activeLink` on the current item and `link` on the rest. The white fill and secondary border live on `.activeLink`, so when `activeId` changes the old pill disappears and the new one appears. Nothing travels.

The working tree (selected state just set to a white fill and secondary border) is:

```css
/* portfolio-main/components/projects/ProjectSectionRail.module.css:21 — current working tree */
.nav {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link,
.activeLink {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  color: var(--color-content-tertiary);
  display: inline-flex;
  font-family: var(--font-family-base);
  font-size: var(--typography-caption-font-size);
  font-weight: var(--typography-caption-font-weight);
  justify-content: center;
  line-height: var(--typography-caption-line-height);
  min-height: 24px;
  padding: 4px 8px;
  text-decoration: none;
  transition:
    background-color var(--duration-fast) var(--ease-smooth),
    border-color var(--duration-fast) var(--ease-smooth),
    color var(--duration-fast) var(--ease-smooth);
  white-space: nowrap;
}

.activeLink {
  background: var(--color-background-contrast);
  border-color: var(--color-border-secondary);
  color: var(--color-content-primary);
}
```

`41d7bd6` still has the older selected fill, `background: var(--color-surface-card-secondary, var(--color-button-secondary-default))`, and no transparent border. Either version is the same bug: the border does not move. The target colors below are the ones to ship. Do not keep the gray secondary fill.

This runs while someone reads a case study and scrolls between sections. The change is occasional, and the purpose is spatial consistency: the same border should be seen moving to the next label. `--ease-smooth` is `cubic-bezier(0.22, 1, 0.36, 1)`, an ease-out. On-screen movement needs ease-in-out. That curve is not in the token source.

## Target

One indicator element, a sibling before the links, carries the white fill and the secondary border. Links stay transparent. Only the label color changes on the active link.

The move is on-screen, so it uses a strong ease-in-out:

```css
/* new token, generated as --ease-in-out */
cubic-bezier(0.77, 0, 0.175, 1)
```

Duration is the existing UI token `--duration-normal` (200ms). Animate `transform` and `width` on the indicator only. Set `transform` and `width` on the indicator element itself. Do not drive them through a custom property on `.nav`. Do not animate `top`, `left`, or `height` (`height` is set so the box matches the label, and every current label is one line, so it does not need to tween). `width` is the one layout property allowed, because `scaleX` would squash the pill radius. Do not use `transition: all`. Do not use `@keyframes`.

Label color stays on the existing ease-out token at `--duration-fast` (150ms): `color var(--duration-fast) var(--ease-smooth)`.

The first measured position must paint with no transition. Later `activeId` changes slide. Reduced motion snaps the indicator (no translate). Label color may still update.

```css
/* target */
.nav {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.indicator {
  background: var(--color-background-contrast);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-full);
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
}

.navReady .indicator {
  transition:
    transform var(--duration-normal) var(--ease-in-out),
    width var(--duration-normal) var(--ease-in-out);
}

.link,
.activeLink {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  color: var(--color-content-tertiary);
  display: inline-flex;
  font-family: var(--font-family-base);
  font-size: var(--typography-caption-font-size);
  font-weight: var(--typography-caption-font-weight);
  justify-content: center;
  line-height: var(--typography-caption-line-height);
  min-height: 24px;
  padding: 4px 8px;
  position: relative;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-smooth);
  white-space: nowrap;
  z-index: 1;
}

.activeLink {
  color: var(--color-content-primary);
}
```

The indicator's inline style, once measured, is exactly:

```tsx
style={{
  height: `${indicator.height}px`,
  transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0px)`,
  width: `${indicator.width}px`
}}
```

`x` is the active link's `offsetLeft`. `y` is its `offsetTop`. `width` and `height` are `offsetWidth` and `offsetHeight`. The nav is `position: relative`, so those offsets are relative to the nav, including the 12px gap. The pill travels on Y. Width eases to the destination label in the same 200ms. It does not fade out on one link and fade in on the next.

## Repo conventions to follow

- Motion tokens are generated. Edit `design-system-tokens/tokens/source.json`, then run the generator. Do not hand-edit `design-system-tokens/src/tokens.css`, `design-system-tokens/src/tokens.ts`, or `portfolio-main/app/styles/generated/tokens.css`.
- Leave `--ease-smooth` unchanged: `cubic-bezier(0.22, 1, 0.36, 1)` at `design-system-tokens/tokens/source.json` under `motion.ease.smooth`.
- Color-only control transition to copy: `portfolio-main/components/Button.module.css` uses `color var(--duration-fast) var(--ease-smooth)` on the button.
- The rail is shared by `portfolio-main/app/projects/crypto-com/page.tsx`, `okx/page.tsx`, and `bowtie/page.tsx`. Change the component, not those pages.
- Keep `dsMarker("ProjectSectionRail")` on the `<aside>`.

## Steps

1. In `design-system-tokens/tokens/source.json`, inside `motion.ease`, add the in-out curve. Leave `smooth` as it is.

```json
"ease": {
  "smooth": "cubic-bezier(0.22, 1, 0.36, 1)",
  "in-out": "cubic-bezier(0.77, 0, 0.175, 1)"
}
```

2. From `design-system-tokens/`, run `npm run tokens:build`. From `portfolio-main/`, run `npm run sync:tokens`. Confirm the generated CSS contains `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);` and that `--ease-smooth` is unchanged. Confirm `design-system-tokens/src/tokens.ts` `motion` includes `"ease-in-out": "cubic-bezier(0.77, 0, 0.175, 1)"`.

3. In `portfolio-main/components/projects/ProjectSectionRail.tsx`, change the React import to:

```tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
```

4. Inside `ProjectSectionRail`, after the `isVisible` state, add measurement. Do not change the intersection observer or the visibility scroll listener.

```tsx
const navRef = useRef<HTMLElement>(null);
const [indicator, setIndicator] = useState({ x: 0, y: 0, width: 0, height: 0 });
const [indicatorReady, setIndicatorReady] = useState(false);

const measureIndicator = () => {
  const nav = navRef.current;
  const active = nav?.querySelector<HTMLElement>("[aria-current='true']");
  if (!nav || !active) {
    return;
  }
  setIndicator({
    x: active.offsetLeft,
    y: active.offsetTop,
    width: active.offsetWidth,
    height: active.offsetHeight
  });
};

useLayoutEffect(() => {
  measureIndicator();
}, [activeId, items, isVisible]);

useEffect(() => {
  const nav = navRef.current;
  if (!nav) {
    return;
  }
  const observer = new ResizeObserver(() => {
    measureIndicator();
  });
  observer.observe(nav);
  return () => observer.disconnect();
}, [activeId, items]);

useEffect(() => {
  const frame = window.requestAnimationFrame(() => setIndicatorReady(true));
  return () => window.cancelAnimationFrame(frame);
}, []);
```

5. Replace the `<nav>` so the indicator is the first child. Keep each link's `href`, `onClick`, `aria-current`, and `tabIndex` as they are. Add `ref={navRef}` and the ready class.

```tsx
<nav
  className={[styles.nav, indicatorReady ? styles.navReady : ""].filter(Boolean).join(" ")}
  ref={navRef}
>
  <span
    aria-hidden="true"
    className={styles.indicator}
    style={
      indicator.width === 0
        ? undefined
        : {
            height: `${indicator.height}px`,
            transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0px)`,
            width: `${indicator.width}px`
          }
    }
  />
  {items.map((item) => {
    const isActive = item.id === activeId;

    return (
      <a
        aria-current={isActive ? "true" : undefined}
        className={isActive ? styles.activeLink : styles.link}
        href={`#${item.id}`}
        key={item.id}
        onClick={() => setActiveId(item.id)}
        tabIndex={isVisible ? undefined : -1}
      >
        {item.label}
      </a>
    );
  })}
</nav>
```

6. In `portfolio-main/components/projects/ProjectSectionRail.module.css`, replace the `.nav` rule through `.activeLink` (the block that currently ends with `color: var(--color-content-primary);`) with the target CSS in the Target section. Leave the focus-visible rule and the `max-width: 1199px` rule unchanged. Do not add a hover color. Unselected labels stay `--color-content-tertiary`.

7. In the existing `prefers-reduced-motion: reduce` block, add `.indicator` to the `transition: none` list and keep the `.rail { transform: translate3d(0, -50%, 0); }` rule:

```css
@media (prefers-reduced-motion: reduce) {
  .rail,
  .link,
  .activeLink,
  .indicator {
    transition: none;
  }

  .rail {
    transform: translate3d(0, -50%, 0);
  }
}
```

## Boundaries

- Do NOT edit the crypto.com, OKX, or Bowtie page files, `portfolio.ts` nav labels, or `DesignSystemPanel.stories.tsx`.
- Do NOT change the intersection observer `rootMargin`, the visibility reveal math, or `left: 40px` on `.rail`.
- Do NOT change the rail's own fade/slide-in (`opacity` and `translate3d(-8px, -50%, 0)`).
- Do NOT add a dependency, a box-shadow, a hardcoded color, or `transition: all`.
- Do NOT change `--ease-smooth` or any duration token.
- Do NOT hand-edit generated token files. If `npm run tokens:build` or `npm run sync:tokens` fails, stop.
- Do NOT animate `top`, `left`, or `height`. Do NOT use `@keyframes` for the pill.
- If `ProjectSectionRail.tsx` no longer swaps `styles.activeLink` / `styles.link` from `activeId`, stop and report instead of improvising.

## Verification

- **Mechanical**: from `design-system-tokens/`, `npm run tokens:check` exits 0. From `portfolio-main/`, `npx tsc --noEmit` exits 0. Search `ProjectSectionRail.module.css` and confirm there is no `transition: all`, no `ease-in` keyword, and `.activeLink` does not set `background` or `border-color`.
- **Feel check**: open `/projects/crypto-com` at a viewport at least 1200px wide. Scroll until the rail is visible, then move from Intro through Takeaway and back.
  - One white pill with a `#f4f4f5` border (`--color-border-secondary` in light mode) travels straight down the list. The previous label does not fade its own border out. At 10% playback in the Animations panel, the pill eases in both directions (slow at the start and the end) over 200ms. "Design outcome" grows the pill width during that same move. The pill does not scale in a way that pinches the radius.
  - Scroll quickly across several sections. The pill retargets from wherever it currently is. It does not jump back to Intro and replay.
  - The first time the rail appears, the pill is already on the active label. It does not fly in from the top of the nav.
  - Toggle `prefers-reduced-motion: reduce`. The pill snaps to the next label with no travel. The label color still updates.
  - Inactive labels have no fill and no visible border, and stay `--color-content-tertiary`. The active label stays `--color-content-primary`.
- **Done when**: the border is a single indicator that translates with `var(--ease-in-out)` and `var(--duration-normal)`, width follows the destination label, and rapid section changes do not restart the move from zero.
