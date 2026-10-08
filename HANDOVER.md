# Eagle Eye — Handover

**Current work:** Phase 3 continuation of the existing `elmalik490/eagle-eye-radar` repository. The one-page GitHub Pages design and deployment workflow are retained. The Phase 3 local implementation has passed the recorded browser checks but is pending final commit/push and exact Pages deployment verification. The public site remains on the previous deployed baseline until that completes.

## Project shape

`index.html` remains the entry point. UI/styles live in `css/app.css`; client orchestration in `js/app.js`; fixture records in `js/demo-data.js`; score arithmetic in `js/scoring.js`; localization in `js/i18n.js`; map behavior in `js/map-view.js`; normalized demo adapter in `js/opportunity-contract.js`; and session-only stages/history in `js/demo-workflow.js`. Leaflet 1.9.4 stays bundled in `vendor/leaflet/`. The static root is deployed through `.github/workflows/pages.yml`; there is no build or backend. See [`DATA_MODEL.md`](DATA_MODEL.md) and [`ARCHITECTURE.md`](ARCHITECTURE.md).

The dossier separates opportunity identity, signal, interpretation, scenario value, evidence, source provenance, priority, freshness, verification, risks and recommendation. All nine records remain `DEMO / SYNTHETIC`; evidence is empty and quality is not assessed; every item stays `UNVERIFIED`. Priority is a deterministic demonstration heuristic and illustrative value range, not a calibrated business conclusion. Map anchors are city-level synthetic placements. OSM is an optional real basemap only, not intelligence evidence.

## Verified local test scope

Chromium/Playwright passed at widths 360, 390, 430, 768, 1024, 1280 and 1440 px, with no horizontal document/body overflow. Six UI dictionaries have the same keys; Arabic RTL and five LTR locales render. Search by ID, taxonomy filtering, selected dossier, evidence checklist remaining unverified, local workflow advance/reset, event timeline, editable draft, readiness status, map view controls/overlays, Miami marker-to-dossier sync, reset, full-screen and Escape were exercised. No JavaScript page exceptions or console errors were observed. OSM requests were intercepted and locally fulfilled during this phase's map test, so the test had no external network egress. This is not a formal accessibility, security, performance or cross-browser audit; the test script was kept under `/tmp` and is not a committed CI suite.

## Next step and boundaries

Finish final diff/build checks, commit only the project files, push the explicitly authorized repository, then verify the exact GitHub Actions deployment and public Page before describing Phase 3 as live. Do not infer deployment success from a successful push alone.

Do not attach real-data connectors or source access without a separate decision on permission and privacy. No prospects, contact details, private research, messages, payments, CRM actions or irreversible external operations are in scope. Workflow movement, “reviewed,” checklist selections and draft text are not formal approvals. Keep private commercial validation outside this public repository.
