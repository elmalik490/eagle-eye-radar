# Eagle Eye — Handover

**Current state:** Phase 5 implementation is locally verified; GitHub Pages publication/live verification is pending. Target public URL: <https://elmalik490.github.io/eagle-eye-radar/>. Confirm the actual current `main` commit and Pages run in [`PROJECT_STATUS.md`](PROJECT_STATUS.md) after publishing.

## Project shape

`index.html` remains the entry point. UI/styles live in `css/app.css`; client orchestration in `js/app.js`; 13 fictional examples and city anchors in `js/demo-data.js`; deterministic scenario/ranking math in `js/scoring.js`; six-language strings in `js/i18n.js`, `js/world-radar-i18n.js`, and `js/phase5-i18n.js`; the 2D adapter in `js/map-view.js`; 3D globe renderer and fallback in `js/globe-view.js`; normalized v3 adapter in `js/opportunity-contract.js`; session-only stages/history in `js/demo-workflow.js`; and simplified public boundaries in `data/countries-110m.geojson`. Leaflet remains under `vendor/leaflet/`; Three.js r186 and its MIT license are under `vendor/three/`. The repository root is published through `.github/workflows/pages.yml`; there is no build or backend. See [`DATA_MODEL.md`](DATA_MODEL.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), and [`data/ATTRIBUTION.md`](data/ATTRIBUTION.md).

## Boundary and validation

All 13 opportunities, signals, marker anchors, and financial assumptions are synthetic; city anchors are not business locations. Boundary geometry and optional OSM streets are real geography only, not intelligence evidence. Initial page rendering makes no external request. Enabling street tiles explicitly requests visible OSM tiles and sends no Eagle Eye records. Evidence remains empty/not assessed and every record remains unverified; the “AI solution” is explicitly not connected. Local stage changes/checklist/draft are not approvals, durable audit history, or external action.

Local Playwright/Chromium checks passed widths 360, 390, 430, 768, 1024, 1280, and 1440 px; all six languages and RTL; list/map/dossier selection; direct 3D marker selection; filter reset; pause/zoom; 2D/3D mode; WebGL2-unavailable and context-loss fallback; and local review/draft boundaries. No horizontal overflow, default external request, console error, or page error was observed. A 360×640 software-rendered Chromium sample yielded about 66 animation callbacks/second; it is not a physical-phone guarantee. This is not a formal accessibility, security, native-mobile, performance-budget, or cross-browser audit.

## Next engineer actions

1. Treat the delivered product as a demo-only interface, not evidence of leakage or market opportunity.
2. Verify the current `main` commit, Pages workflow, and live app/assets before stating that this release is deployed.
3. Use [`ROADMAP.md`](ROADMAP.md) to decide one narrow, owner-approved revenue-leakage job-to-be-done, then specify one lawful/authorized source contract and review measures before processing any real information.
4. Keep private evidence and prospects outside this public repository. Do not introduce real source access, external messages, CRM writes, payments, or automation without explicit scope and authorization.

No prospect/business was contacted, no payment was made, and no external business action was executed.
