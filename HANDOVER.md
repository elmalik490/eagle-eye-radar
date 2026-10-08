# Eagle Eye — Handover

**Current state:** improved static prototype in the existing `elmalik490/eagle-eye-radar` repository. This continuation began from commit `dea3bc609f976ab7f153e7e9e9dd47141d0eb325` on `main`; the existing GitHub Pages deployment structure is preserved. The implementation changes are ready for a commit/push and public deployment verification.

## What is present

`index.html` remains the entry point. The application is split across `css/app.css`, `js/app.js`, `js/demo-data.js`, `js/scoring.js`, `js/i18n.js`, and `js/map-view.js`; Leaflet 1.9.4 is locally included under `vendor/leaflet/` with its license. `.github/workflows/pages.yml` continues to deploy the repository root. See [ARCHITECTURE.md](ARCHITECTURE.md) for module responsibility and [README.md](README.md) for operation.

The interface includes responsive search/filters, six languages with Arabic RTL, synthetic opportunity cards and scoring explanations, opt-in map loading and OSM attribution, a checklist that stays unverified, and an editable local-only internal note. None of the fixtures describe real businesses or observed revenue loss. Map circles and city anchors are synthetic overlays, not business location data.

## Local verification completed

Chromium/Playwright reported no horizontal overflow at 360, 390, 430, 768, 1024, 1280, and 1440 pixels and no JavaScript page exceptions in the measured flows. All six UI translation dictionaries contained all rendered interface keys. Filtering to Miami/Roofing returned one scenario. Arabic RTL and the Arabic draft were checked. No OSM tile request occurred before the person selected the visible map-load action; afterwards all three city-centroid markers rendered, marker selection updated the dossier, the World control and overlays worked, and the mapped test requested eight visible tiles. Checklist interaction did not change `UNVERIFIED`. There is no committed browser-test suite yet.

## Deployment next step

1. Review and commit the current working tree to `main`.
2. Push the authorized repository update; GitHub Actions will run the existing Pages workflow.
3. Confirm that the run succeeded for the exact commit and that the live URL serves the new HTML, JavaScript, CSS and vendor assets. Until that live check succeeds, describe the local build as tested but do not claim the public deployment has been verified.

No migration or build step is needed. Run `python3 -m http.server 8080` in the repository to preview locally. Use the map-load control to test optional OSM tiles.

## Safety and privacy boundaries

The app has no backend, real-data connector, business discovery, verified evidence, durable approval, CRM, external send capability, billing or payment. No prospect was contacted and no external irreversible action was taken. The private commercial-validation materials remain outside this public repository; do not add prospect identities, contact details, private research or private spreadsheet contents here. Any future outreach or consequential external action needs its own explicit authorization and an approved private workflow.
