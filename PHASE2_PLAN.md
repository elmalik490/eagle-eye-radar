# Eagle Eye Phase 2 — ranked implementation plan

| Rank | Improvement | Value | Effort | Risk | Outcome |
|---|---|---|---|---|---|
| 1 | Desktop command-center layout, compact responsive mobile view and usable opportunity search/filter/list/detail flow | High | Medium | Low | **Implemented and browser-tested**; existing static entry point and behavior retained. |
| 2 | Explicit demo/real-data boundary and explainable opportunity score/value assumptions | High | Medium | Low | **Implemented**; all records remain synthetic and unverified; formula and dimensions exposed. |
| 3 | Safer human verification and action workflow | High | Medium | Low | **Implemented**; checklist stays unverified, and a translated editable note is local-only with no send route. |
| 4 | Six-language localized UI, including Arabic RTL, plus map layer separation | High | Medium | Low–Medium | **Implemented and tested**; map itself stays optional and decoupled from intelligence scoring. |
| 5 | Real basemap plus city-level synthetic markers/overlays | Medium–High | Medium | Medium | **Implemented** with local Leaflet 1.9.4; OSM raster tiles are requested only after explicit load action. Not a production tile service. |
| 6 | Real evidence sources, connectors, CRM, backend or automated outreach | Future | High | High | **Deferred.** Requires a separate approved source, authorization, privacy/security design, measured score and external-action guardrails. |

## Architecture and guardrails

This is an incremental static-site implementation: `index.html` remains the entry point and `.github/workflows/pages.yml` remains the deployment workflow. Code responsibilities are separated into `js/app.js`, `js/demo-data.js`, `js/scoring.js`, `js/i18n.js`, and `js/map-view.js`, plus `css/app.css` and locally bundled `vendor/leaflet/` assets. There is no framework migration, API key, account, backend, database, source connector, automation or messaging service.

OSM tile access is a separate basemap dependency, not intelligence ingestion. The explicit map-load button discloses that visible tiles will be requested; attribution is shown, and only visible standard tiles were observed. The standard OSM tile endpoint is best-effort and not appropriate to assume as a commercial-scale SLA or unlimited quota; choose a suitable provider/self-hosted service before commercial use.

Every opportunity, map marker, circle, priority and scenario value remains `DEMO / SYNTHETIC` and `UNVERIFIED`. Scoring assumptions are illustrative, not validated confidence or expected recovery. Checklist input never verifies a record. Draft and history behavior is local and non-persistent. No business is contacted and no external irreversible action is implemented.

## Verification performed locally

Playwright/Chromium checked viewports 360, 390, 430, 768, 1024, 1280 and 1440 pixels (no horizontal overflow or page exceptions); six UI dictionaries and Arabic RTL; Miami/Roofing filtering and translated draft; marker/dossier selection, World view and demo-layer toggles. No map tile request occurred until explicit map loading, after which eight visible OSM tile requests were recorded. This is not a committed automated regression test suite or public-deployment verification.
