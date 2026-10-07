# Architecture

## Current architecture

Eagle Eye v0.1 is a static single-page prototype. It has no application build system, server, backend, database, API integration, or external action service.

```text
Browser
  ├─ index.html: structure, inline styles, inline JavaScript
  ├─ Tailwind CSS: loaded from the public CDN at runtime
  └─ In-page DOM state: selectors, scan card, Verify panel, Act/Draft panel

GitHub main push / manual dispatch
  └─ .github/workflows/pages.yml
       ├─ checkout repository
       ├─ configure GitHub Pages
       ├─ upload repository root as Pages artifact
       └─ deploy artifact to GitHub Pages
```

## UI behavior and data

- The two `<select>` controls provide three locations and three sectors. JavaScript reads their values when `runScan()` runs.
- `runScan()` hides prior panels, shows a scan indicator, waits 1.2 seconds, then fills and reveals the opportunity card.
- The displayed revenue-risk and confidence values are hard-coded by location only: Phoenix `$14,200 / mo` and `80%`; Miami `$18,500 / mo` and `85%`; Houston `$11,000 / mo` and `75%`.
- Sector is displayed on the card but does not affect those values. Evidence text and verification details are static placeholder copy.
- `toggleVerifyModal()` and `toggleActModal()` only toggle local DOM visibility.
- The demo approval button invokes a local `alert()` and does not call a message, SMS, voice, payment, or business API.
- The page visibly marks the opportunity data `DEMO / SYNTHETIC` and its status `UNVERIFIED`.

## Deployment

The Pages workflow is configured for the repository root and runs on pushes to `main` or `workflow_dispatch`. It uses GitHub's checkout, Pages configuration, artifact-upload, and deployment actions. There is no compile or packaging stage. The default page is the root `index.html`.

The documentation-only handover commit adds Markdown files at the repository root. It does not change application code or the workflow; because the workflow watches all pushes to `main`, it triggers another deployment of the same static app content.

## Operational implications

- Tailwind styling depends on network access to the public CDN.
- All demo state is ephemeral and resets on page reload.
- The synthetic metrics/evidence must not be presented as verified facts about a real company or market.
