# Architecture

## Current system: client-side static prototype

GitHub Pages serves the repository root; there is no application server, build step, backend, or real-data provider. The existing single-page `index.html` remains the entry point. It loads self-hosted styles and ES modules plus the local Leaflet bundle. Language preference is stored in browser local storage. Workflow stages and local audit-style events use `sessionStorage` for the current tab/session only; these are not durable, authoritative, or server-audited.

```text
index.html
  ├─ css/app.css                    responsive UI, six-language RTL styles, map/dossier/pipeline
  ├─ js/app.js                      filters, search, dossier, summary, demo workflow composition
  ├─ js/demo-data.js                nine fictional fixtures, sector assumptions, city anchors
  ├─ js/opportunity-contract.js     normalized v1 fixture-to-opportunity adapter
  ├─ js/scoring.js                  illustrative ranges and heuristic synthetic priority only
  ├─ js/demo-workflow.js            sessionStorage stage/event model; no network writes
  ├─ js/i18n.js                     EN/FR/AR/RU/ZH/KO UI translations and RTL
  ├─ js/map-view.js                 optional Leaflet adapter and synthetic city overlays
  └─ vendor/leaflet/                local Leaflet 1.9.4 JavaScript/CSS, images, license

GitHub Actions
  └─ .github/workflows/pages.yml → publish repository root to GitHub Pages
```

## Modules and boundaries

- **Fixture data:** `demo-data.js` supplies nine deterministic fictional city/sector records. City coordinates are only geographic display anchors and do not represent businesses, observations, or opportunity locations. Revenue-leakage category cards distinguish the three generic synthetic signal types from concept-only categories.
- **Contract adapter:** `opportunity-contract.js` maps a fixture plus its illustrative score into the documented versioned shape in [`DATA_MODEL.md`](DATA_MODEL.md). The contract keeps signal, evidence, interpretation, scenario value, priority, freshness, verification, provenance, risk, recommendation and workflow stage distinct. Available evidence stays empty; freshness is demo-session metadata; evidence quality and several risks remain not assessed.
- **Scenario and priority:** `scoring.js` displays USD scenario ranges from stated hypothetical ticket/leads/recovery/city assumptions. Priority weights are synthetic demand (35%), illustrative scenario scale (40%) and synthetic urgency (25%). Evidence quality is intentionally not folded into priority because the demo has no evidence. The score is not a probability, calibrated forecast, verified exposure or recovered value.
- **Dossier and workflow:** `app.js` renders identity, signal, interpretation, value scenario, evidence gaps, provenance, separate priority/freshness/quality/verification, risk and recommendation. Human review and draft behavior remain local; no message, CRM write or action is sent. `demo-workflow.js` permits local-only DETECTED → REVIEW → VERIFICATION → QUALIFIED → ACTION READY → RESOLVED changes; these workflow stages do not change `verificationStatus: unverified`. The per-record session timeline contains local UI and stage events, not formal approvals or a durable audit log.
- **Search and command summary:** search matches stable demo ID, location, sector, signal category and signal description. Dashboard metrics count demo records/local stage state and show a selected record's assumption-based range. They are not financial totals or business KPIs.
- **Localization:** `i18n.js` covers new workflow, evidence, provenance, risk, trust and readiness UX in EN/FR/AR/RU/ZH/KO. Arabic is RTL; others are LTR.
- **Map adapter:** `map-view.js` remains separate from discovery/scoring. Marker selection synchronizes filters, selected dossier and the city anchor. Priority color, selection ring, leakage/demand, verification and risk overlays are synthetic city-level indicators. Leaflet and application assets are hosted locally. OSM raster tiles are requested only after an explicit load-map action, with attribution shown; the standard tile server is best effort, not a commercial SLA or scale entitlement.
- **Deployment:** `.github/workflows/pages.yml` uploads and deploys the repository root on pushes to `main` or manual dispatch; no compile/package stage exists.

## Real behavior versus synthetic behavior

**Real:** static page rendering, local search/filter/sort, browser-side workflow state, language preference, optional map controls, and the third-party OSM base-map geometry when the visitor explicitly loads the map.

**DEMO / SYNTHETIC:** every opportunity, signal, score, financial range, priority band, provenance record, evidence placeholder, risk framing, leakage category example, map marker/overlay, and workflow/audit event. The basemap is not evidence for the synthetic intelligence layer. No source connector, business record, observed signal, verified leakage, or customer action is implemented.

## Intentional future seams and omissions

No ingestion API, connector registry, source permission enforcement, backend, database, authentication, tenant boundary, durable audit/approval record, CRM, analytics, queue, scheduler, automated outreach or payment exists. These are future decisions, not capabilities implied by the v1 contract. Any real-data phase requires lawful/authorized sources, provenance and correction, privacy/retention, source quality, operational security, tenant isolation, calibrated measurement, human approval and failure handling before implementation.
