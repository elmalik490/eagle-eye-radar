# Eagle Eye — World Opportunity Radar

Eagle Eye is an evolving **static opportunity-intelligence prototype**. Phase 4.2 continues the existing single-page v0.1 project; it is not a rebuild or a production revenue-recovery service. Its opportunity layer contains only fictional, locally authored scenarios. It does **not** discover businesses, detect actual leakage, verify a loss, or recover revenue.

## Live app and repository

- GitHub Pages: <https://elmalik490.github.io/eagle-eye-radar/>
- Repository: <https://github.com/elmalik490/eagle-eye-radar>
- Default branch: `main`; Pages publishes the repository root from `.github/workflows/pages.yml`.
- Phase 4.2 implementation commit: [`5e1ba8afd50a609bf80886b03549f4ec16219b97`](https://github.com/elmalik490/eagle-eye-radar/commit/5e1ba8afd50a609bf80886b03549f4ec16219b97); Pages workflow run [#37724305759](https://github.com/elmalik490/eagle-eye-radar/actions/runs/37724305759) succeeded.
- Commit-specific live check: <https://elmalik490.github.io/eagle-eye-radar/?v=5e1ba8afd50a609bf80886b03549f4ec16219b97>. The published entry point, CSS, modules, Leaflet assets and world GeoJSON were checked after deployment.

## What the prototype does

- Preserves the existing static page and GitHub Pages workflow; no framework/backend rebuild or build step.
- Shows a local Natural Earth world-boundary map with **12 fictional public-city anchors** across six broad regions. A marker is a city anchor, not a company, lead, or observed event.
- Supports World, Region, Country and City map views; selection from map/list; a synchronized opportunity dossier; city/country/region, sector, type and heuristic-priority filters; and stable-ID/location/category search.
- Presents a structured signal dossier with the fictional problem pattern, interpretation, explicitly hypothetical monthly value range and assumptions, unverified evidence status, source limitations, and suggested evidence/review step.
- Shows deterministic demo priority dimensions separately from verification and evidence quality.
- Retains a local-only, editable draft and human-approval boundary. Review checklists and workflow-stage changes never verify a record or send an action.
- Includes six languages: English, French, Arabic (RTL), Russian, Chinese and Korean.
- Uses a responsive map-first mobile layout, a right-side collapsible filter drawer and a mobile dossier sheet.

## DEMO / SYNTHETIC versus real behavior

**Real functionality:** static rendering, browser-side search/filter/selection, local synthetic-example generation, local workflow/draft UI, language preference, and rendering of public geographic boundary data. The boundary data is a locally bundled, simplified Natural Earth derivative; source and terms are recorded in [`data/ATTRIBUTION.md`](data/ATTRIBUTION.md).

**DEMO / SYNTHETIC:** all 12 opportunity records, signals, IDs, scores, priority bands, dollar ranges, assumptions, evidence placeholders, recommendations and map markers. The basemap is not evidence for the opportunity layer. There is no connected business, revenue, CRM, call, service, transaction, lead, or other source. No signal or loss is verified.

Priority is a deterministic sorting heuristic over three pre-authored demo dimensions: demand (45%), urgency (30%) and scope (25%). These fixture values are not measured. Evidence quality and confidence remain **not assessed**; priority is not probability, prediction, verified exposure, or expected recovery. The USD monthly value range is an illustrative calculation from visible synthetic assumptions, not observed business performance.

## Map network behavior

The default map draws local vector boundaries and synthetic city markers without requesting a map service. The optional street-tile switch is off by default. A visible pre-click notice says that enabling it requests only visible OpenStreetMap tiles and sends **no Eagle Eye records**. If enabled, the browser requests tiles from `tile.openstreetmap.org`; attribution is displayed. This public tile service is best-effort and is not a production SLA or commercial-scale entitlement. See [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md).

## Run locally

No build step is required. From the repository root:

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>. Application modules, Leaflet 1.9.4 and world-boundary data are served locally. An optional user action is required before any OpenStreetMap tile request.

## Main files

`index.html` remains the entry point; `css/app.css` owns responsive, mobile and RTL presentation; `js/app.js` orchestrates filters, dossier and local workflow; `js/demo-data.js` holds the fictional fixtures; `js/scoring.js` calculates illustrative ranges and deterministic demo ranking; `js/opportunity-contract.js` maps fixtures to the versioned v2 contract; `js/demo-workflow.js` owns session-only stages/events; `js/i18n.js` and `js/world-radar-i18n.js` provide six-language strings; `js/map-view.js` adapts Leaflet and synthetic markers; and `data/countries-110m.geojson` contains simplified public geographic boundaries. [`DATA_MODEL.md`](DATA_MODEL.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`PHASE42_IMPLEMENTATION_PLAN.md`](PHASE42_IMPLEMENTATION_PLAN.md), and the status/limitations/roadmap/handover documents record design and state.

## Explicit boundaries

There is no backend, database, authentication, tenant isolation, real-data connector, durable audit log, enforced approval, CRM, automated execution, external messaging, payment flow or real opportunity discovery. Session workflow state can be lost. “Reviewed,” stage movement, checklist selection and a draft are not formal approvals or business decisions. Do not put prospects, contact details or private validation materials in this public repository.
