# Growth track (G1+) — after mobile

**Foundation**, **Revamp R1–R12**, and **Mobile MF1–MF12** are complete on `main`.

This track ships high-impact gaps from [FEATURE_GAP.md](../FEATURE_GAP.md) — one branch per slice, same test loop as revamp/mobile.

## Progress

| Phase | Focus | Status | Branch |
|:-----:|-------|--------|--------|
| G1 | List multi-select + bulk status / priority / assignee | **complete** | `growth/g1-list-bulk` |

## Loop

`git checkout main && git pull` → `growth/g{N}-…` → `npm test` + `npm run test:coverage` → `npm run build` → PR → merge.
