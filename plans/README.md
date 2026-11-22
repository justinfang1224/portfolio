# Animation plans

| Plan | Title | Severity | Status |
| --- | --- | --- | --- |
| [001](001-project-filter-tabs.md) | Slide the project filter as one tab pill | HIGH | REVERTED |
| [002](002-section-rail-slide.md) | Slide the section-rail pill straight to the next item | HIGH | DONE |

## Order

1. `002-section-rail-slide.md` — no dependencies. This plan adds `--ease-in-out`.
2. `001-project-filter-tabs.md` — stay reverted unless someone asks to restore the filter. If it is executed after 002, skip its token step; `--ease-in-out` will already exist. Do not change `--ease-smooth`.

## Notes

`002` is the section rail on Crypto.com, OKX, and Bowtie. The selected white pill and secondary border should travel on Y. `001` is a different control and is not part of this change.
