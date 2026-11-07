# 001 — Slide the project filter as one tab pill

- **Status**: REVERTED
- **Commit**: d08aac5
- **Severity**: HIGH
- **Category**: Interruptibility, easing & duration, cohesion & tokens
- **Estimated scope**: 4 files (token source + generated tokens, projects index, projects CSS)

## Problem

The project filter at `portfolio-main/app/projects/ProjectsIndex.tsx:185` is two separate chips. The selected chip paints its own background; the other chip goes transparent. Nothing moves from one tab to the other, so the switch reads as two fades instead of one control. Counts also collapse with a keyframe and `max-width`, which restarts if interrupted and changes layout.

The list under the tabs can get stuck invisible. `portfolio-main/app/projects/ProjectsIndex.tsx:157-179` fades the panel out, waits 160ms, then swaps content. The CSS fade is 200ms (`portfolio-main/app/projects/page.module.css:103-110`), so the swap happens before the fade finishes. If the user clicks the other tab before 160ms, the cleanup cancels the timeout and this effect returns early because `selectedTab === visibleTab`, leaving `isPanelVisible` false.

```tsx
/* portfolio-main/app/projects/ProjectsIndex.tsx:157 — current */
useEffect(() => {
  if (selectedTab === visibleTab) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    setVisibleTab(selectedTab);
    setIsPanelVisible(true);
    return;
  }

  setIsPanelVisible(false);

  const timeoutId = window.setTimeout(() => {
    setVisibleTab(selectedTab);
    window.requestAnimationFrame(() => setIsPanelVisible(true));
  }, 160);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [selectedTab, visibleTab]);
```

```css
/* portfolio-main/app/projects/page.module.css:27 — current */
.tabs {
  align-items: center;
  display: flex;
  gap: var(--space-2);
}

.activeTab,
.inactiveTab {
  align-items: center;
  appearance: none;
  border: 0;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-family-base);
  font-size: var(--typography-button-font-size);
  font-weight: var(--typography-button-font-weight);
  line-height: var(--typography-button-line-height);
  min-height: 34px;
  padding: var(--space-2) var(--space-4);
  transition: background-color var(--duration-fast) var(--ease-smooth), color var(--duration-fast) var(--ease-smooth);
  white-space: nowrap;
}

.activeTab {
  background: var(--color-button-secondary-default);
  color: var(--color-content-primary);
  gap: var(--space-2);
}

.inactiveTab {
  background: transparent;
  color: var(--color-content-tertiary);
}
```

```css
/* portfolio-main/app/projects/page.module.css:93 — current */
.hiddenTabCount {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transform: translate3d(-6px, 0, 0);
}

.tabCountSlideIn {
  animation: tabCountSlideIn var(--duration-slow) var(--motion-fade-ease) both;
}
```

The target visual is the default variant on [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/base/tabs): one muted track, triggers inside it, and the selected trigger sitting on a page-colored pill. Keep the existing status dot, and render it only inside the selected tab: `--color-status-positive` on Case study, `--color-status-warning` on Archived. The inactive tab does not include the dot in its layout. The dot fades in with opacity only (`@starting-style`, `--duration-fast`, `--ease-smooth`). Its 6px size is the existing dot size. Do not install shadcn, Base UI, `class-variance-authority`, or Tailwind. Do not copy `transition-all` or `shadow-sm` from that source. This repo has no shadow token.

## Target

One track. Both labels and both counts stay visible, so the pill width does not collapse mid-slide. The status dot stays, and only the selected tab renders it. A single indicator element slides between the two triggers.

The slide is on-screen movement, so it uses a strong ease-in-out, not the existing ease-out token:

```css
/* new token, generated as --ease-in-out */
cubic-bezier(0.77, 0, 0.175, 1)
```

Duration is the existing UI token `--duration-normal` (200ms). Animate `transform` and `width` on the indicator only. `width` is the one layout property allowed, because `scaleX` would squash the corner radius. Do not use `transition: all`. Do not drive the transform through a custom property on the parent; set `transform` and `width` on the indicator element.

Color changes on the labels stay on the existing ease-out token at `--duration-fast` (150ms), matching `portfolio-main/components/Button.module.css:60-68`.

The panel fade stays an entrance/exit: opacity plus an 8px transform, `--duration-normal`, `--ease-smooth` (`cubic-bezier(0.22, 1, 0.36, 1)`). Swap the panel content on `transitionend` for `opacity`, not on a 160ms timeout. Clicking back while the fade is in progress must reverse with CSS and must not leave the panel at opacity 0.

Reduced motion snaps the indicator and shows the new panel immediately. Opacity may still change; the translate must not.

Token map, shadcn default variant to this design system:

| shadcn default | Use this |
| --- | --- |
| `bg-muted` track | `background: var(--color-background-secondary)` |
| `rounded-lg` track | `border-radius: var(--radius-md)` |
| `p-[3px]`, `h-8` | `padding: var(--space-1)`; no fixed pixel height |
| `rounded-md` selected pill | indicator `border-radius: var(--radius-sm)` |
| `text-sm font-medium` | `var(--font-family-base)` and `var(--typography-button-font-size/weight/line-height)` |
| inactive `text-foreground/60` | `color: var(--color-content-tertiary)` |
| hover and active text | `color: var(--color-content-primary)` |
| `data-active:bg-background` | indicator `background: var(--color-background-contrast)` |
| count metadata | `color: var(--color-content-tertiary)` on both tabs |
| `shadow-sm` | omit |
| `transition-all` | omit |

## Repo conventions to follow

- Motion tokens are generated. Edit `design-system-tokens/tokens/source.json`, then run the generator. Do not hand-edit `design-system-tokens/src/tokens.css`, `design-system-tokens/src/tokens.ts`, or `portfolio-main/app/styles/generated/tokens.css`.
- Existing ease token, leave it unchanged: `--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1)` in `design-system-tokens/tokens/source.json:43-45`.
- Color-only control transition to copy: `portfolio-main/components/Button.module.css:60-68` uses `color var(--duration-fast) var(--ease-smooth)`.
- Page gutters stay on `var(--portfolio-text-column)`. Do not set a tab width in `vw` or a fixed pixel width.
- Focus ring already used here: `outline: 2px solid var(--color-content-primary); outline-offset: 2px`.

## Steps

1. In `design-system-tokens/tokens/source.json`, inside `motion.ease`, add the in-out curve. Leave `smooth` as it is.

```json
"ease": {
  "smooth": "cubic-bezier(0.22, 1, 0.36, 1)",
  "in-out": "cubic-bezier(0.77, 0, 0.175, 1)"
}
```

2. From `design-system-tokens/`, run `npm run tokens:build`. From `portfolio-main/`, run `npm run sync:tokens`. Confirm the generated CSS contains `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);` and that `--ease-smooth` is unchanged. Confirm `design-system-tokens/src/tokens.ts` `motion` includes `"ease-in-out": "cubic-bezier(0.77, 0, 0.175, 1)"`.

3. In `portfolio-main/app/projects/ProjectsIndex.tsx`, change the React import to include `useLayoutEffect` and `useRef`:

```tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
```

4. Delete the `hasTappedTab` state. Replace the tab-switch effect and add indicator measurement. Keep `visibleTab`, `isPanelVisible`, `selectedTab`, and `setActiveTab` as they are apart from removing `setHasTappedTab(true)` inside `setActiveTab`.

```tsx
const listRef = useRef<HTMLDivElement>(null);
const [indicator, setIndicator] = useState({ x: 0, width: 0 });
const [indicatorReady, setIndicatorReady] = useState(false);

const measureIndicator = () => {
  const list = listRef.current;
  const active = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  if (!list || !active) {
    return;
  }
  setIndicator({ x: active.offsetLeft, width: active.offsetWidth });
};

useLayoutEffect(() => {
  measureIndicator();
  setIndicatorReady(true);
}, [selectedTab]);

useEffect(() => {
  const list = listRef.current;
  if (!list) {
    return;
  }
  const observer = new ResizeObserver(() => {
    measureIndicator();
  });
  observer.observe(list);
  return () => observer.disconnect();
}, [selectedTab]);

useEffect(() => {
  if (selectedTab === visibleTab) {
    setIsPanelVisible(true);
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    setVisibleTab(selectedTab);
    setIsPanelVisible(true);
    return;
  }

  setIsPanelVisible(false);
}, [selectedTab, visibleTab]);

const handlePanelTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
  if (event.target !== event.currentTarget || event.propertyName !== "opacity") {
    return;
  }
  if (selectedTab === visibleTab) {
    return;
  }
  setVisibleTab(selectedTab);
  window.requestAnimationFrame(() => setIsPanelVisible(true));
};
```

5. Replace the tablist markup. Both counts render on every paint. Render the status dot only inside the selected button. The indicator is a sibling before the buttons, with `pointer-events: none`. Arrow keys move between the two tabs and move focus with the selection. Clicking still uses `setActiveTab`.

```tsx
<div
  aria-label="Project filters"
  className={[styles.tabs, indicatorReady ? styles.tabsReady : ""].filter(Boolean).join(" ")}
  onKeyDown={(event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const next = selectedTab === "case-studies" ? "archive" : "case-studies";
    setActiveTab(next);
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const nextIndex = next === "case-studies" ? 0 : 1;
    tabs?.[nextIndex]?.focus();
  }}
  ref={listRef}
  role="tablist"
>
  <span
    aria-hidden="true"
    className={styles.tabIndicator}
    style={
      indicator.width === 0
        ? undefined
        : {
            transform: `translate3d(${indicator.x}px, 0px, 0px)`,
            width: `${indicator.width}px`
          }
    }
  />
  <button
    aria-selected={selectedTab === "case-studies"}
    className={selectedTab === "case-studies" ? styles.activeTab : styles.inactiveTab}
    onClick={() => setActiveTab("case-studies")}
    role="tab"
    tabIndex={selectedTab === "case-studies" ? 0 : -1}
    type="button"
  >
    <span>Case study</span>
    <span className={styles.tabCount}>4</span>
  </button>
  <button
    aria-selected={selectedTab === "archive"}
    className={selectedTab === "archive" ? styles.activeTab : styles.inactiveTab}
    onClick={() => setActiveTab("archive")}
    role="tab"
    tabIndex={selectedTab === "archive" ? 0 : -1}
    type="button"
  >
    <span>Archived</span>
    <span className={styles.tabCount}>6</span>
  </button>
</div>
```

6. Pass `onTransitionEnd={handlePanelTransitionEnd}` to the existing panel div that already has `styles.tabPanel` (`ProjectsIndex.tsx` around the `tabPanel` className). Do not change the archive list, the case-study cards, or `MotionReveal`.

7. In `portfolio-main/app/projects/page.module.css`, replace the `.tabs` rule through the `tabCountSlideIn` keyframes (current lines 27–133) with the rules below. Keep `.headingGroup` and everything after it.

```css
.tabs {
  align-items: center;
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
  display: inline-flex;
  gap: 0;
  padding: var(--space-1);
  position: relative;
  width: fit-content;
}

.tabIndicator {
  background: var(--color-background-contrast);
  border-radius: var(--radius-sm);
  bottom: var(--space-1);
  left: 0;
  pointer-events: none;
  position: absolute;
  top: var(--space-1);
}

.tabsReady .tabIndicator {
  transition:
    transform var(--duration-normal) var(--ease-in-out),
    width var(--duration-normal) var(--ease-in-out);
}

.activeTab,
.inactiveTab {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--color-content-tertiary);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-family-base);
  font-size: var(--typography-button-font-size);
  font-weight: var(--typography-button-font-weight);
  gap: var(--space-1);
  line-height: var(--typography-button-line-height);
  padding: var(--space-1) var(--space-3);
  position: relative;
  transition: color var(--duration-fast) var(--ease-smooth);
  white-space: nowrap;
  z-index: 1;
}

.activeTab,
.inactiveTab:hover {
  color: var(--color-content-primary);
}

.activeTab:focus-visible,
.inactiveTab:focus-visible {
  outline: 2px solid var(--color-content-primary);
  outline-offset: 2px;
}

.tabCount {
  color: var(--color-content-tertiary);
  display: inline-block;
}

.tabPanel {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transition:
    opacity var(--duration-normal) var(--ease-smooth),
    transform var(--duration-normal) var(--ease-smooth);
  width: 100%;
}

.tabPanelHidden {
  opacity: 0;
  transform: translate3d(0, var(--space-2), 0);
}

.tabPanelVisible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
```

8. In the `max-width: 767px` block, replace `.tabs { flex-wrap: wrap; }` with:

```css
.tabs {
  flex-wrap: nowrap;
  max-width: 100%;
}
```

9. In the `prefers-reduced-motion: reduce` block, stop listing `.tabCountSlideIn`. Add `.tabIndicator { transition: none; }` and keep the existing `.tabPanel` / `.tabPanelHidden` / `.tabPanelVisible` rules that drop the transition and the transform. The reduced-motion block should include:

```css
@media (prefers-reduced-motion: reduce) {
  .activeTab,
  .inactiveTab,
  .projectImage,
  .statusBadge,
  .tabIndicator,
  .tabPanel {
    transition: none;
  }

  .projectMedia:hover .projectImage,
  .projectMedia:focus-visible .projectImage,
  .projectMedia:focus-within .projectImage {
    transform: none;
  }

  .tabPanelHidden,
  .tabPanelVisible {
    opacity: 1;
    transform: none;
  }
}
```

Leave the `.projectImage` and `.statusBadge` rules in that block as they are today. Delete the `.tabCountSlideIn { animation: none; }` rule only because that class no longer exists.

## Boundaries

- Do NOT install shadcn, `@base-ui/react`, `class-variance-authority`, or Tailwind.
- Do NOT edit `portfolio-main/.storybook/design-system/DesignSystemTabs.tsx` or its CSS.
- Do NOT edit homepage tabs, the floating nav, `MotionReveal`, or project detail pages.
- Do NOT change heading copy, archive rows, case-study cards, or the `?tab=archive` URL behavior.
- Do NOT add a box-shadow, a hardcoded color, a hardcoded font size, or `transition: all`.
- Do NOT change `--ease-smooth` or any duration token.
- Do NOT hand-edit generated token files. If `npm run tokens:build` or `npm run sync:tokens` fails, stop.
- If the cited line ranges no longer match `d08aac5` (the chips, the 160ms timeout, or the `tabCountSlideIn` keyframes are gone), stop and report instead of improvising.

## Verification

- **Mechanical**: from `design-system-tokens/`, `npm run tokens:check` exits 0. From `portfolio-main/`, `npx tsc --noEmit` exits 0. Search the projects CSS and confirm there is no `tabCountSlideIn`, no `max-width: 0` on a tab count, no `transition: all`, and no `ease-in` keyword.
- **Feel check**: open `/projects`. Confirm the control is one secondary track with a contrast pill behind the selected label, button type (15px / weight 500), and both counts visible. Toggle light and dark. Click Archived, then Case study.
  - The pill translates from one label to the other. It does not fade one chip out and another in. At 10% playback in the Animations panel, the pill eases in both directions (slow at the start and the end), over 200ms.
  - Spam the two tabs. The pill retargets from wherever it is. It does not jump back to the start. The list never stays blank.
  - The outgoing list fades and moves 8px, the incoming list fades back. The content swap happens only after the fade-out opacity transition ends, not halfway through.
  - First load does not show the pill growing from the left edge.
  - Toggle `prefers-reduced-motion: reduce`. The pill snaps. The list swaps with no vertical travel. Text color still updates.
  - At 360px and 375px, `document.documentElement.scrollWidth === window.innerWidth`. The track stays inside the text column.
- **Done when**: the filter matches the shadcn default track-and-pill structure using only the tokens listed above, the pill slides with `var(--ease-in-out)` and `var(--duration-normal)`, and rapid switching cannot leave the panel hidden.
