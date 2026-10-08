# Phase 4.2 — Implementation Plan and Result

The plan preserves the existing single-page Eagle Eye prototype, static GitHub Pages deployment, Leaflet module and local synthetic fixtures. It does not authorize real-data ingestion, business contact, external automation, payments or a framework/backend rebuild. The design was informed by the 13 research notes in [`research/phase42/`](research/phase42/).

## Ranked scope

| Rank | Improvement | Value | Effort | Risk | Result |
|---:|---|---|---|---|---|
| P0-1 | Make the product a local world radar: public world geometry, globally distributed fictional city anchors, no default tile/network dependency | Very high | Medium | Low | Implemented locally; no external request on initial render. |
| P0-2 | Connect exploration → map/list selection → an explanatory dossier; improve scoped views, search, filters, reset and mobile use | Very high | Medium | Low–medium | Implemented and smoke-tested; existing page and modules retained. |
| P0-3 | Improve signal/evidence/value/priority explanations without implying real findings or AI | Very high | Medium | Low | Implemented; v2 contract separates hypothesis, empty evidence, assumptions, deterministic demo ranking and unverified status. |
| P0-4 | Make a responsive map-first mobile/desktop workspace with compact filter drawer and collapsible dossier | High | Medium | Medium | Implemented; seven responsive widths checked without horizontal overflow; Arabic drawer direction checked. |
| P1-1 | Keep scan and map network behavior transparent; external map tiles remain explicit and off by default | High | Low–medium | Low | Implemented; default external requests are zero; optional tile fetch is disclosed and intercepted in the test. |
| P1-2 | Localize the new experience in six languages, including Arabic RTL, accessible labels and reduced motion | High | Medium | Low | Implemented; all six languages and RTL/LTR direction tested locally. |

## Deliberately out of scope

- No real businesses, opportunities, loss data, lead discovery, service/call/revenue connectors, or live indicators.
- No login, backend, database, CRM, external message, payment, subscription, approval enforcement or persistent audit.
- No AI inference; deterministic fixture arithmetic is not represented as AI.
- No provider switch, paid map API, real-time heatmap or bulk map tiles.

## Acceptance checks performed locally

- Viewports 360, 390, 430, 768, 1024, 1280 and 1440 px: no body/document horizontal overflow. Map occupies approximately 68% of phone viewport height; clean phone and desktop screenshots were visually reviewed.
- Search/filter/list/map selection, synthetic scenario scan, World/Region/Country/City controls, map reset/fullscreen/Escape and marker-to-dossier synchronization.
- Local verification checklist remains unverified; stage move/reset/history and editable internal draft do not send data.
- Six locales, Arabic RTL and drawer behavior; reduced-motion preference; all key UI labels populated.
- No external request on initial load. After explicit OSM toggle, the visible-tile request was intercepted/aborted by the local browser test (no egress); attribution and pre-click notice remain.
- JavaScript syntax checks and `git diff --check` pass; Playwright page exceptions and non-test console errors: zero.

## Publication gate

At authoring time, these are local results only. Confirm the exact code commit, Pages workflow and commit-specific public assets before marking deployment complete in [`PROJECT_STATUS.md`](PROJECT_STATUS.md) and [`HANDOVER.md`](HANDOVER.md). The temporary Playwright script is not committed as CI.

## Research basis

Research synthesis and sources are in [`research/phase42/00-synthesis.md`](research/phase42/00-synthesis.md) and the 13 individual notes. The chosen approach retains Leaflet, uses a small local public-domain world outline for the default view, keeps OSM street tiles opt-in, and distinguishes real geography from synthetic signals.
