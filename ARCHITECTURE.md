# Architecture

## Current: client-side static prototype

GitHub Pages serves the repository root; there is no application server or build step. The existing single-page `index.html` remains the entry point. It links to self-contained CSS, ES modules and a local Leaflet bundle. UI state is held in memory for the page session, and the selected interface language is held in local browser storage.

```text
index.html
  ├─ css/app.css                 responsive UI, breakpoints, RTL, Leaflet styles
  ├─ js/app.js                   UI composition, filters, dossier, local review/draft
  ├─ js/demo-data.js             fictional records, sectors, city anchor coordinates
  ├─ js/scoring.js               transparent scenario arithmetic and heuristic score
  ├─ js/i18n.js                  UI text for en/fr/ar/ru/zh/ko and RTL
  ├─ js/map-view.js              optional Leaflet adapter and demo-only overlays
  └─ vendor/leaflet/             local Leaflet 1.9.4 JavaScript/CSS, images, license

GitHub Actions
  └─ .github/workflows/pages.yml → publish repository root to GitHub Pages
```

### Responsibilities and behavior

- **Synthetic data:** `demo-data.js` builds a small fixed set of fictional city/sector scenarios. City coordinate anchors are geographic display points only; they do not represent business addresses or detected market opportunities.
- **Scoring and scenario arithmetic:** `scoring.js` computes illustrative ranges from explicit ticket/leads/recovery assumptions, city multipliers and deterministic heuristic dimensions. These calculations are not empirically calibrated, verified financial exposure, forecasts, or claims of recoverable revenue. The UI exposes the score dimensions and keeps the entire result marked synthetic and unverified.
- **Presentation and workflow:** `app.js` filters/sorts the local records, renders opportunity details, records page-session actions locally, and prepares an editable internal-only draft. The evidence checklist is a human review aid only; ticking boxes never verifies data or changes `UNVERIFIED` status. No outward action is implemented.
- **Localization:** `i18n.js` handles interface strings, saved language preference, and Arabic right-to-left direction. User-facing controls, map labels and draft guardrails are translated; fictional data remains clearly synthetic.
- **Map adapter:** `map-view.js` has no role in discovery, scoring, or verification. The locally hosted Leaflet runtime and page assets load without a third-party JavaScript/CSS CDN. Raster tiles are requested from the OpenStreetMap standard tile endpoint only following the user-visible load-map action; attribution is displayed on the map. Tile traffic is handled by the browser, limited to visible tiles, and is not Eagle Eye opportunity or business data. The standard tile endpoint is best-effort—not a production SLA, offline source, or entitlement for high-volume use. Adopt a suitable provider or self-hosted tiles before commercial-scale usage.
- **Deployment:** `.github/workflows/pages.yml` checks out the repository, configures Pages, uploads the repository root and deploys it on pushes to `main` or manual dispatch. There is no compile or packaging stage.

## Intentional omissions and future seams

There is no connector registry, ingestion API, data normalization pipeline, backend, database, user authentication, organization boundary, source permission model, durable case history, approval/audit record, CRM, analytics telemetry, task queue, scheduler, business lookup or outbound messaging. These are future design seams only—not implemented modules or implied capability. Any future real-data design needs a source/citation model, lawful and authorized access, data quality and retention rules, tenant isolation/security, calibrated scoring and human-reviewed acceptance criteria before coding.
