# Eagle Eye — Handover

**Current state:** Phase 4.2 World Radar is deployed to GitHub Pages and live-verified. Product-code commit: `5e1ba8afd50a609bf80886b03549f4ec16219b97`. Pages workflow run [37724305759](https://github.com/elmalik490/eagle-eye-radar/actions/runs/37724305759) succeeded. Public URL: <https://elmalik490.github.io/eagle-eye-radar/>.

## Project shape

`index.html` remains the entry point. UI/styles live in `css/app.css`; client orchestration in `js/app.js`; 12 fictional examples and city anchors in `js/demo-data.js`; deterministic scenario/ranking math in `js/scoring.js`; six-language strings in `js/i18n.js` plus `js/world-radar-i18n.js`; map behavior in `js/map-view.js`; normalized v2 adapter in `js/opportunity-contract.js`; session-only stages/history in `js/demo-workflow.js`; and simplified public boundaries in `data/countries-110m.geojson`. Leaflet 1.9.4 remains under `vendor/leaflet/`. The repository root is published through `.github/workflows/pages.yml`; there is no build or backend. See [`DATA_MODEL.md`](DATA_MODEL.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`data/ATTRIBUTION.md`](data/ATTRIBUTION.md).

## Boundary and validation

All opportunities, signals, markers and financial assumptions are synthetic; city anchors are not business locations. Boundary geometry and optionally loaded OSM streets are real geography only, not intelligence evidence. Initial page rendering makes no external request. Enabling street tiles explicitly requests only visible OSM raster tiles and sends no opportunity records. Evidence remains empty/not assessed and every record remains unverified. Local stage changes/checklist/draft are not approvals, durable audit history or external action.

Local Playwright/Chromium checks covered widths 360, 390, 430, 768, 1024, 1280 and 1440 px; six languages and RTL; search/filter/list/dossier; map scope/selection/reset/fullscreen; local verification/workflow/draft; reduced motion; and an intercepted optional tile request. Live public checks confirmed the code assets return HTTP 200 and match the implementation commit, the world map and 12 markers render after initialization, and the 390×844 Arabic RTL layout and filter drawer have no horizontal overflow. Default live page generated no non-GitHub request; app errors and console errors were zero. The smoke script is in `/tmp/eagle_phase42_test.py`, not CI. This is not a formal accessibility, security, performance or cross-browser audit.

## Next engineer actions

1. Treat the delivered product as a demo-only interface, not evidence of leakage or market opportunity.
2. Use [`ROADMAP.md`](ROADMAP.md) to decide one narrow, owner-approved revenue-leakage job-to-be-done, then specify one lawful/authorized source contract and review measures before processing any real information.
3. Keep private evidence and prospects outside this public repository. Do not introduce real source access, external messages, CRM writes, payments or automation without explicit scope and authorization.

No prospect/business was contacted, no payment was made, and no external action was executed.
