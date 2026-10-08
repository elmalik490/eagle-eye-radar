# Architecture

## Current system: client-side static prototype

GitHub Pages serves the repository root. The existing one-page `index.html`, ES modules and Leaflet library are retained; there is no build pipeline, application server, backend or real-data provider. Language preference is browser-local. Workflow stages and event history use `sessionStorage` in the current browser session/tab only; they are not durable, authoritative, or server-audited.

```text
index.html
  ├─ css/app.css                       responsive UI, RTL, mobile drawer/sheet, map/dossier
  ├─ js/app.js                         search, filters, dossier, local workflow, language/UI composition
  ├─ js/demo-data.js                   12 fictional city anchors, four sectors/types, six regions
  ├─ js/scoring.js                     illustrative monthly range and deterministic demo priority
  ├─ js/opportunity-contract.js        versioned v2 fixture-to-opportunity adapter
  ├─ js/demo-workflow.js               sessionStorage stages/events; no network writes
  ├─ js/i18n.js                        existing six-language dictionaries and RTL behavior
  ├─ js/world-radar-i18n.js             World Radar terms in EN/FR/AR/RU/ZH/KO
  ├─ js/map-view.js                     Leaflet adapter, local world polygons, synthetic city markers
  ├─ data/countries-110m.geojson       simplified Natural Earth public boundary geometry
  ├─ data/ATTRIBUTION.md                origin, public-domain terms, simplification and hash
  └─ vendor/leaflet/                    local Leaflet 1.9.4 assets and license

GitHub Actions
  └─ .github/workflows/pages.yml → publish repository root to GitHub Pages
```

## Modules and boundaries

- **Fixture data:** `demo-data.js` supplies 12 fixed fictional scenarios at public city anchors across six broad regions. Coordinates are for map composition only and do not indicate businesses, observations, incidents or opportunity locations. Sector/ticket/prospect/recovery assumptions and all signal dimensions are pre-authored demo values.
- **Map geometry:** `countries-110m.geojson` is a simplified Natural Earth 1:110m public-domain derivative. It is geographic context only, not evidence or commercial intelligence. It is locally fetched by the app; the map's raster street tiles remain off until explicit opt-in.
- **Contract adapter:** `opportunity-contract.js` maps a fixture and its deterministic synthetic score to schema version 2 in [`DATA_MODEL.md`](DATA_MODEL.md). Signal, empty evidence, interpretation, hypothetical value, demo priority, freshness, unverified status, provenance, risk, recommendation and workflow state remain distinct.
- **Scenario and priority:** `scoring.js` calculates USD monthly ranges from hypothetical prospect counts × ticket ranges × recoverable-share assumptions. The heuristic uses fictional demand (45%), urgency (30%) and scope (25%). No score component is measured evidence, confidence, prediction or recovered revenue.
- **Dossier and workflow:** `app.js` renders a hypothesis-led dossier and a human-review checklist. `demo-workflow.js` permits local-only DETECTED → REVIEW → VERIFICATION → QUALIFIED → ACTION READY → RESOLVED changes. Movement does not change `verificationStatus: unverified`; draft/review is not an external action or formal approval.
- **Search and navigation:** fixture search matches stable synthetic ID and location/category/sector text; map, list and dossier selections synchronize. Map view selection has explicit world, region, country and city scopes; filters can be reset. The mobile filter drawer and dossier sheet are UI-only.
- **Localization:** the two translation modules augment EN/FR/AR/RU/ZH/KO; Arabic is RTL. User language preference is browser-local.
- **Map adapter:** Leaflet stays isolated from discovery/scoring. Synthetic marker selection updates the dossier. The local map has no default network dependency. Opting into street tiles may request visible tiles from `tile.openstreetmap.org`, with attribution and a pre-click notice; no opportunity record is sent to OSM.
- **Deployment:** `.github/workflows/pages.yml` uploads and deploys the repository root on pushes to `main` or manual dispatch; no compile/package step is required.

## Real behavior versus synthetic behavior

**Real:** static page rendering, local filtering/search/selection, browser-side demo workflow/draft UI, language preference, local display of simplified public boundary geography, and (only after opt-in) the third-party OpenStreetMap street-tile basemap.

**DEMO / SYNTHETIC:** every opportunity, event, company-related inference, marker, signal, category example, score dimension, priority, financial range, assumption, evidence placeholder, provenance, risk, recommendation and workflow activity. A real basemap does not make the intelligence layer real. There is no connected source, discovered business, observed event, verified leakage, or customer action.

## Intentional future seams and omissions

The v2 contract is a client-side shape, not a connector API or promise of source compatibility. No ingestion API, source-permission enforcement, backend, authentication, tenant boundary, durable evidence/audit/approval record, CRM, analytics, queue, scheduler, outreach or payment exists. Any real-data phase requires explicit lawful/authorized sources, provenance, correction/removal, privacy/retention, security and tenant design, measured evidence quality, calibration, human approval and operational failure handling before implementation. Commercial tile-provider terms and capacity must be evaluated before relying on a public tile service at scale.
