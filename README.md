# Eagle Eye — Opportunity Radar

Eagle Eye is an evolving **static opportunity-intelligence prototype**. Phase 3 continues the existing v0.1/v0.2 project and Pages architecture; it is not a rebuild or a production revenue-recovery service. The interface uses synthetic scenarios only. It does **not** discover real businesses, verify actual revenue leakage, or recover revenue.

## Live app and repository

- GitHub Pages: <https://elmalik490.github.io/eagle-eye-radar/>
- Repository: <https://github.com/elmalik490/eagle-eye-radar>
- Default branch: `main`
- Deployment: `.github/workflows/pages.yml` publishes the repository root on pushes to `main` and manual dispatch.
- Phase 3 deployment: verified at commit `016aab34e543d566ced34d88535294f9650220d1`; the Pages Action completed successfully, and the public page and new modules returned HTTP 200.

## Current demo capabilities

- Existing single-page architecture with responsive desktop/mobile command-center layouts; seven viewport sizes from 360 to 1440 px were checked without horizontal overflow.
- English, French, Arabic (RTL), Russian, Chinese and Korean interfaces; language preference remains browser-local.
- Search by synthetic opportunity ID, city/location, sector or signal, plus location, sector, type, heuristic priority and verification filters.
- A revenue-leakage taxonomy distinguishes categories with generic synthetic fixtures from concept-only categories.
- Opportunity dossier separates identity, signal, interpretation, scenario value, evidence and gaps, source provenance, priority score/dimensions, freshness, verification, risks and recommended next step.
- A versioned opportunity v1 data shape provides an adapter seam. See [`DATA_MODEL.md`](DATA_MODEL.md) and [`ARCHITECTURE.md`](ARCHITECTURE.md).
- A six-stage, browser-session-only workflow (Detected → Review → Verification → Qualified → Action Ready → Resolved), with per-record local event history and reset. Stages never make evidence verified or authorize an action.
- Editable internal-only draft, explicit human-approval guardrail, and local evidence checklist. Draft creation does not send or contact anyone.
- Optional interactive Leaflet map with World/Country/City views, selected-city sync, synthetic priority/selection indicators and leakage/demand/verification/risk overlays. Map library/assets are local. Raster tiles are requested only after the visible opt-in load action; attribution is displayed.
- An explicit data-readiness view shows future connection categories as **NOT CONNECTED**.

## DEMO / SYNTHETIC versus real behavior

All nine opportunity records, IDs, signals, scores, priorities, dollar ranges, assumptions, provenance, evidence placeholders, risk labels, leakage category example counts, map anchors/overlays and workflow events are synthetic or local UI state. There is no connected real-data source. The basemap can show real streets/place labels when the visitor opts into OSM tiles, but it does not validate the demo layer.

The priority score is a deterministic demo heuristic: synthetic demand (35%), illustrative scenario scale (40%) and synthetic urgency (25%). Evidence quality is deliberately separate and **not assessed**, because no evidence is connected. The score is not a probability, validated forecast, verified exposure, or recoverable revenue. The value range is a monthly illustrative scenario built from visible hypothetical assumptions—not business performance data.

## Run locally

No build step is required. From the repository root:

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. The page, styles, modules and Leaflet library are served locally. If a visitor chooses **Load interactive map**, the browser requests the visible tiles from `tile.openstreetmap.org`; availability is best effort, not a production SLA. The map includes attribution.

## Main files

`index.html` remains the entry point; `css/app.css` owns the responsive and RTL design; `js/app.js` handles UI orchestration, search, dossier and local workflow; `js/demo-data.js` holds fictional fixtures; `js/opportunity-contract.js` normalizes the demo fixture; `js/scoring.js` calculates illustrative ranges and heuristic priority; `js/demo-workflow.js` owns session-only stages/events; `js/i18n.js` provides six-language strings; and `js/map-view.js` adapts Leaflet and synthetic overlays. `vendor/leaflet/` contains local Leaflet 1.9.4 files and license. [`DATA_MODEL.md`](DATA_MODEL.md), [`PHASE3_PLAN.md`](PHASE3_PLAN.md), and the status/architecture/roadmap/limitations/changelog/handover documents record scope and state.

## Explicit boundaries

No backend, database, real lead discovery, authenticated source access, CRM, persistent review/audit trail, automated execution, external messaging, payment flow or approval enforcement is implemented. Workflow events live only in current browser session storage and can be lost. “Reviewed,” stage movement and draft are not durable approvals or business decisions. Do not put prospects, contact details or private validation materials in this public repository.
