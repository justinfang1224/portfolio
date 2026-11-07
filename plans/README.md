# Animation plans

| Plan | Title | Severity | Status |
| --- | --- | --- | --- |
| [001](001-project-filter-tabs.md) | Slide the project filter as one tab pill | HIGH | REVERTED |

## Order

1. `001-project-filter-tabs.md` — no dependencies.

## Notes

`001` adds `--ease-in-out` to the design-system token source and regenerates tokens. It does not change `--ease-smooth` or any duration. Execute that plan before any later plan that wants the same on-screen curve.
