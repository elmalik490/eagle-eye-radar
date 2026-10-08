# Architecture

## Current system: client-side static prototype

GitHub Pages serves the repository root. The existing one-page `index.html`, ES modules, and Leaflet adapter remain; Phase 5 adds a separately scoped Three.js view without a framework or backend rebuild. Language preference is browser-local. Workflow stages and event history use `sessionStorage` in the current browser session/tab only; they are not durable, authoritative, or server-audited.

```text
index.html
  ├─ css/app.css                        responsive UI, RTL, mobile drawer/sheet, map/globe/dossier/HUD
  ├─ js/app.js                          search, filters, dossier, local workflow, language/UI composition
  ├─ js/demo-data.js                    13 fictional city anchors, synthetic opportunity fixtures
  ├─ js/scoring.js                      illustrative monthly range and deterministic demo priority
  ├─ js/opportunity-contract.js         versioned v3 fixture-to-opportunity adapter and claim states
  ├─ js/demo-workflow.js                sessionStorage stages/events; no network writes
  ├─ js/i18n.js                         base six-language dictionaries and RTL behavior
  ├─ js/world-radar-i18n.js              World Radar terms in EN/FR/AR/RU/ZH/KO
  ├─ js/phase5-i18n.js                   Phase 5 HUD/globe terms in EN/FR/AR/RU/ZH/KO
  ├─ js/map-view.js                      Leaflet adapter, local world polygons, synthetic city markers
  ├─ js/globe-view.js                    Three.js renderer, local texture, interaction, FPS/context fallback
  ├─ data/countries-110m.geojson        simplified Natural Earth public boundary geometry
  ├─ data/ATTRIBUTION.md                 origin, public-domain terms, simplification and hash
  ├─ vendor/leaflet/                     local Leaflet assets and license
  └─ vendor/three/                       local Three.js r186 build assets and MIT license

GitHub Actions
  └─ .github/workflows/pages.yml → publish repository root to GitHub Pages
```

## Modules and boundaries

- **Fixture data:** `demo-data.js` supplies 13 fixed fictional scenarios at public city anchors across seven broad regions. Coordinates are for composition only; they do not indicate businesses, observations, incidents, or opportunity locations. Sector, ticket, prospect, recovery assumptions, and signal dimensions are pre-authored demo values.
- **Geographic data:** `countries-110m.geojson` is a simplified Natural Earth 1:110m public-domain derivative. It is geographic context only, not evidence or commercial intelligence. The app fetches it locally. Optional street tiles remain off until explicit opt-in.
- **3D globe:** `globe-view.js` builds a 1024×512 equirectangular texture from the local GeoJSON, wraps it on a Three.js sphere, adds a graticule, atmosphere/radar rings, and fictional markers. Three.js r186 and its MIT license are stored under `vendor/three/`; no runtime CDN/API is used. Pointer/touch rotation, wheel/pinch zoom, keyboard controls, pause/resume, marker picking, and renderer lifecycle are isolated in this adapter.
- **2D adapter and fallback:** Leaflet remains the selectable 2D Tactical Map and is the fallback when WebGL2 is unavailable, WebGL context is lost, or the renderer detects sustained very low frame rate. The fallback preserves the selected synthetic record, filters, language, and local workflow. OSM tiles are an independent explicit opt-in, not required for either view.
- **Contract adapter:** `opportunity-contract.js` maps a fixture and deterministic synthetic score to schema v3 in [`DATA_MODEL.md`](DATA_MODEL.md). Signal, empty evidence, interpretation, hypothetical value, demo priority, freshness, provenance, risk, recommendation, claim states, and workflow state remain separate.
- **Scenario and priority:** `scoring.js` calculates USD monthly ranges from hypothetical prospect counts × ticket ranges × recoverable-share assumptions. The heuristic uses fictional demand (45%), urgency (30%), and scope (25%). No score component is measured evidence, confidence, prediction, or recovered revenue.
- **Dossier and workflow:** `app.js` renders a hypothesis-led dossier, disconnected-AI disclosure, three-step Business Blueprint, and human-review checklist. `demo-workflow.js` permits local-only stage/event changes. Movement does not change `verificationStatus: unverified`; draft/review is not an external action or formal approval.
- **Search and navigation:** fixture search matches stable synthetic ID and location/category/sector text; globe/map, list, and dossier selections synchronize. Map scope selection has explicit world, region, country, and city states. Filters can be reset; mobile drawers and dossier sheet are UI-only.
- **Localization:** the translation modules provide EN/FR/AR/RU/ZH/KO. Arabic is RTL, including globe controls and drawers. Language preference is browser-local.
- **Deployment:** `.github/workflows/pages.yml` uploads and deploys the repository root on pushes to `main` or manual dispatch; no compile/package step is required.

## Real behavior versus synthetic behavior

**Real:** static rendering; client-side filtering, search, and selection; browser-side demo workflow/draft UI; browser-local language preference; rendering of simplified public boundary geography; and (only after opt-in) a request for visible public OSM raster tiles.

**DEMO / SYNTHETIC:** all opportunity records, event claims, business-related inferences, marker anchors, signal categories, score dimensions, priority, financial ranges, assumptions, evidence placeholders, provenance, risk, recommendations, and workflow examples. A real basemap or model name does not make the intelligence layer real. The AI solution is not connected or generated. There is no connected source, discovered business, observed event, verified leakage, or customer action.

## Intentional future seams and omissions

The v3 contract is a client-side shape, not a connector API or promise of source compatibility. No ingestion API, source-permission enforcement, backend, authentication, tenant boundary, durable evidence/audit/approval record, CRM, analytics, queue, scheduler, outreach, payment, or automated business action exists. Any real-data phase requires explicit lawful/authorized sources, provenance, correction/removal, privacy/retention, security and tenant design, measured evidence quality, calibration, human approval, and operational failure handling before implementation. Commercial tile-provider terms and capacity must be evaluated before relying on public tiles at scale.
