## 2026-10-08 — Phase 2: command-center UI and map foundation
- Continued the existing static prototype; preserved the root `index.html` and Pages workflow, with no framework or backend rebuild.
- Added responsive command-center/mobile views; connected local filters to synthetic records; expanded assumption-based value ranges and heuristic score dimensions.
- Added English/French/Arabic/RTL/Russian/Chinese/Korean UI, a local data/scoring/map module split, and Leaflet 1.9.4 bundled with its license.
- Added an explicit-load Leaflet map with World/Country/City views, city-anchor markers, illustrative overlays and OSM attribution; preserved local-only review/draft handling and the `UNVERIFIED` checklist state.
- Public Pages for that phase was verified at commit `b1c753d47425fa6e5a2088a2f56102fa05f79d86`.

## 2026-10-08 — Phase 3: opportunity contract and local review workflow
- Added a documented v1 opportunity contract (`DATA_MODEL.md`) and a local adapter that separates identity, signal, evidence, scenario value, priority, freshness, verification, provenance, uncertainty/risk, recommendation and workflow stage.
- Reworked priority to use only explicitly synthetic demand, illustrative scenario scale and synthetic urgency weights. Evidence quality is excluded and separately shown as **Not assessed**; signal strength and source freshness are not measured. The number is labelled a demo heuristic, not confidence or probability.
- Expanded the selected opportunity dossier with stable synthetic ID, session generation time, assumptions, evidence gaps, source/permission status, verification state, risk and human-approved next-step guardrails.
- Added a local six-stage workflow, per-record `sessionStorage` event timeline and reset. Stages never verify evidence or send/authorize anything. Added ID search, fixture-backed leakage taxonomy and per-connector **NOT CONNECTED** status.
- Improved map synchronization/highlight/priority, selection, verification and risk overlays; added legend, reset and full-screen/Escape controls while preserving city-level synthetic precision and explicit map loading.
- Completed new UX translations for all six languages; retained Arabic RTL; refined compact navigation, dossier, status labels and responsive layers.
- Local Playwright/Chromium: seven viewport widths without horizontal overflow; all six dictionaries/key sets complete; search, taxonomy, evidence-unverified behavior, draft, stage advance/reset, timeline and locale/RTL checks passed; map controls/three markers/six overlays and Miami dossier sync passed. No JS exceptions or console errors. OSM tile requests were intercepted and locally fulfilled during this Phase 3 test; no external network egress occurred.
- No real-data connector, backend, CRM, automation, outbound contact, payment or durable approval/audit record was added. Public deployment remains pending for the Phase 3 commit.
