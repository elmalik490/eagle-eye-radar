# Eagle Eye — Handover

**Current state at authoring:** Phase 4.2 World Radar changes are implemented and locally smoke-tested but have not yet been committed/deployed. Do not describe the candidate as live until its Pages workflow and commit-specific public assets are checked. The static architecture and existing deployment workflow remain intact.

## Project shape

`index.html` remains the entry point. UI/styles live in `css/app.css`; client orchestration in `js/app.js`; 12 fictional examples and city anchors in `js/demo-data.js`; deterministic scenario/ranking math in `js/scoring.js`; six-language strings in `js/i18n.js` plus `js/world-radar-i18n.js`; map behavior in `js/map-view.js`; normalized v2 adapter in `js/opportunity-contract.js`; session-only stages/history in `js/demo-workflow.js`; and simplified public boundaries in `data/countries-110m.geojson`. Leaflet 1.9.4 remains under `vendor/leaflet/`. The repository root is published through `.github/workflows/pages.yml`; there is no build or backend. See [`DATA_MODEL.md`](DATA_MODEL.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`data/ATTRIBUTION.md`](data/ATTRIBUTION.md).

## Boundary and validation

All opportunities, signals, markers and financial assumptions are synthetic; city anchors are not business locations. Boundary geometry and optionally loaded OSM streets are real geography only, not intelligence evidence. Initial page rendering makes no external request. Enabling street tiles explicitly requests only visible OSM raster tiles and sends no opportunity records. Evidence remains empty/not assessed and every record remains unverified. Local stage changes/checklist/draft are not approvals, durable audit history or external action.

Local Playwright/Chromium checks covered widths 360, 390, 430, 768, 1024, 1280 and 1440 px; six languages and RTL; search/filter/list/dossier; map scope/selection/reset/fullscreen; local verification/workflow/draft; reduced motion; and a tile request intercepted before network egress. No horizontal overflow, page exceptions or non-test console errors were observed. The smoke script lives in `/tmp/eagle_phase42_test.py`, not the repository or CI. This is not a formal accessibility, security, performance or cross-browser audit.

## Next engineer actions

1. Confirm the Phase 4.2 commit exists on `main`; check the matching GitHub Actions Pages run.
2. Load the public URL with that exact SHA in the query string; verify entry point, CSS, modules, local GeoJSON and Leaflet assets return successfully and that the page renders.
3. Update [`PROJECT_STATUS.md`](PROJECT_STATUS.md) and this handover with the final SHA/run/live result after evidence is collected.
4. Keep the three next product decisions in [`ROADMAP.md`](ROADMAP.md): validate a narrow use case, choose an authorized source contract, then calibrate priority against reviewed outcomes.

No prospect/business was contacted and no payment or irreversible external action was taken. Do not add real records, contacts, connectors, business claims or outbound automation without separate explicit scope and authorization.
