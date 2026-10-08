# Eagle Eye — Opportunity Radar

Eagle Eye is an evolving **static opportunity-intelligence prototype**. The current interface improves the existing v0.1 project; it is not a rebuilt backend product and it does **not** discover real businesses, verify actual revenue leakage, or recover revenue.

## Live app and repository

- GitHub Pages: <https://elmalik490.github.io/eagle-eye-radar/>
- Repository: <https://github.com/elmalik490/eagle-eye-radar>
- Default branch: `main`
- Deployment: `.github/workflows/pages.yml` publishes the repository root on pushes to `main` and on manual dispatch.

## Current demo capabilities

- Responsive desktop command-center and compact mobile layouts; seven viewport sizes from 360 to 1440 pixels were checked for horizontal overflow.
- English, French, Arabic (RTL), Russian, Chinese, and Korean interface; language choice stays in local browser storage.
- Search and filters for location, sector, synthetic signal type and heuristic demo priority; selecting a result updates the detail panel.
- Optional interactive Leaflet map with World/Country/City views, synthetic city-centroid markers and demo-only overlays. The map library is hosted in this repository. Raster tiles are requested from OpenStreetMap **only after a person selects “Load interactive map.”** Visible OSM attribution and a privacy note are provided.
- A synthetic, sector-specific scenario value range with a visible assumptions formula; a weighted demo score and dimension breakdown; both are heuristic illustrations only.
- A human-led evidence checklist that **never** changes a record out of `UNVERIFIED`, plus an editable internal-only draft and local session history.

All scenario records, scores, range assumptions, map circles and markers remain `DEMO / SYNTHETIC`; city anchors are not business locations. No live sources or external send capability exist.

## Run locally

No build step is required. From the repository root:

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. The page, styles, application modules and Leaflet library are served locally. If the user chooses to load the interactive map, the browser requests visible map tiles from `tile.openstreetmap.org`; the optional standard tile service is best-effort, not a production SLA. OSM attribution is shown in the map.

## Main files

- `index.html` — existing single-page entry point and semantic UI.
- `css/app.css` — self-contained responsive design system.
- `js/app.js` — client-side orchestration, filters, local review and draft flow.
- `js/demo-data.js` — fictional scenario fixtures and city-level map anchors.
- `js/scoring.js` — assumption-based ranges and transparent heuristic scoring.
- `js/i18n.js` — six-language interface dictionary and RTL handling.
- `js/map-view.js` — optional Leaflet map adapter, city markers and demo overlays.
- `vendor/leaflet/` — locally hosted Leaflet 1.9.4 files and license.
- `PHASE2_PLAN.md`, `PROJECT_STATUS.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `KNOWN_ISSUES.md`, `CHANGELOG.md`, `HANDOVER.md` — scope and status documentation.

## Explicit boundaries

No backend, database, real lead discovery, authenticated source access, CRM, persistent review/audit trail, automated execution, customer contact, billing or payment flow is implemented. “Reviewed” is local-only page state, not an approval record. The demo is not commercially or empirically validated. Keep prospect identities, contact information, private research and private commercial-validation materials out of this public repository.
