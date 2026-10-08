# Phase 4.2 — Implementation Plan and Result

The plan preserves the existing single-page Eagle Eye prototype, static GitHub Pages deployment, Leaflet module and local synthetic fixtures. It does not authorize real-data ingestion, business contact, external automation, payments or a framework/backend rebuild. The design was informed by the 13 research notes in [`research/phase42/`](research/phase42/).

## Ranked scope

| Rank | Improvement | Value | Effort | Risk | Result |
|---:|---|---|---|---|---|
| P0-1 | Make the product a local world radar: public world geometry, globally distributed fictional city anchors, no default tile/network dependency | Very high | Medium | Low | Implemented, deployed and live-tested; no external request on initial render. |
| P0-2 | Connect exploration → map/list selection → an explanatory dossier; improve scoped views, search, filters, reset and mobile use | Very high | Medium | Low–medium | Implemented and smoke-tested locally and on the deployed page; existing page and modules retained. |
| P0-3 | Improve signal/evidence/value/priority explanations without implying real findings or AI | Very high | Medium | Low | Implemented; v2 contract separates hypothesis, empty evidence, assumptions, deterministic demo ranking and unverified status. |
| P0-4 | Make a responsive map-first mobile/desktop workspace with compact filter drawer and collapsible dossier | High | Medium | Medium | Implemented; seven widths checked without horizontal overflow; deployed Arabic RTL drawer checked. |
| P1-1 | Keep scan and map network behavior transparent; external map tiles remain explicit and off by default | High | Low–medium | Low | Implemented; initial live request set was same-origin only; optional tile fetch is disclosed and was intercepted locally. |
| P1-2 | Localize the new experience in six languages, including Arabic RTL, accessible labels and reduced motion | High | Medium | Low | Implemented; six languages and RTL/LTR direction tested locally; Arabic tested on the live page. |

## Deliberately out of scope

- No real businesses, opportunities, loss data, lead discovery, service/call/revenue connectors, or live indicators.
- No login, backend, database, CRM, external message, payment, subscription, approval enforcement or persistent audit.
- No AI inference; deterministic fixture arithmetic is not represented as AI.
- No provider switch, paid map API, real-time heatmap or bulk map tiles.

## Acceptance checks performed

- Local widths 360, 390, 430, 768, 1024, 1280 and 1440 px: no body/document horizontal overflow. Map occupies approximately 68% of phone viewport height; phone, desktop and Arabic RTL screenshots were visually reviewed.
- Search/filter/list/map selection, synthetic scenario scan, World/Region/Country/City controls, map reset/fullscreen/Escape and marker-to-dossier synchronization.
- Local verification checklist remains unverified; stage move/reset/history and editable internal draft do not send data.
- Six locales, Arabic RTL and drawer behavior; reduced-motion preference; key UI labels populated.
- No external request on initial local or live page. Optional OSM request is explicitly disclosed, off by default, and was intercepted/aborted in the local test; attribution remains visible.
- JavaScript syntax checks and `git diff --check` pass. Local and live Chromium page exceptions and non-test console errors: zero.
- Live code commit `5e1ba8afd50a609bf80886b03549f4ec16219b97`; Pages run [37724305759](https://github.com/elmalik490/eagle-eye-radar/actions/runs/37724305759) succeeded. Commit-specific public resources returned HTTP 200 and matched source files. The live world map/canvas and all 12 markers rendered at 1440×1000; 390×844 Arabic RTL had no horizontal overflow and its filter drawer opened within the viewport.

## Publication gate — complete

The deployed app is at <https://elmalik490.github.io/eagle-eye-radar/>. The commit-specific verification URL is <https://elmalik490.github.io/eagle-eye-radar/?v=5e1ba8afd50a609bf80886b03549f4ec16219b97>. The Playwright script remains in `/tmp` and is not a committed CI regression suite; these checks are not a formal accessibility/security/performance audit.

## Research basis

Research synthesis and sources are in [`research/phase42/00-synthesis.md`](research/phase42/00-synthesis.md) and the 13 individual notes. The chosen approach retains Leaflet, uses a small local public-domain world outline for the default view, keeps OSM street tiles opt-in, and distinguishes real geography from synthetic signals.
