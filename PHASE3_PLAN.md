# Eagle Eye Phase 3 — plan and outcome

**Baseline inspected:** `b1c753d47425fa6e5a2088a2f56102fa05f79d86`; clean `main` before work. Existing GitHub Pages architecture, six-language UI, opt-in OSM tiles and synthetic-only data were preserved.

## Ranked plan and status

| Rank | Improvement | Value | Effort | Risk | Status |
|---|---|---:|---:|---:|---|
| 1 | Document a versioned opportunity contract and restructure the dossier around identity, signal, scenario value, evidence/provenance, verification, separate priority/freshness/quality, risk and human-approved next step. | High | Medium | Low | Implemented and documented in `DATA_MODEL.md`; deployed and live-checked. Empty evidence and unassessed quality stay explicit. |
| 2 | Add a local-only DETECTED → REVIEW → VERIFICATION → QUALIFIED → ACTION READY → RESOLVED flow, per-record event timeline and reset without turning stage into verification or external execution. | High | Medium | Low | Implemented in `js/demo-workflow.js` using tab/session storage. Workflow tests confirm `UNVERIFIED` remains unchanged. |
| 3 | Strengthen trust/readiness and revenue-leakage UX; add stable-ID search and synchronize/highlight map selection with dossier. | High | Medium | Low–Medium | Implemented: ID search, fixture-backed vs concept-only leakage taxonomy, six not-connected source categories, high synthetic uncertainty, priority/selection legend, overlay/layer sync, updated six-language strings. |
| 4 | Extra map overlays/fullscreen/reset beyond prior basic map; keep city-level precision and avoid unnecessary tile traffic. | Medium | Medium | Medium | Implemented selectively: priority, verification and risk demo overlays plus reset/fullscreen/Escape. No street/business-level markers or non-opt-in loading added. |
| 5 | Real connectors, authentication, private records, CRM, scraping, AI API, messages, payments or backend. | Future | High | High | Out of scope; nothing added. |

## Acceptance checks recorded

All new interface keys exist across English, French, Arabic, Russian, Chinese and Korean; Arabic is RTL. Seven viewport widths (360, 390, 430, 768, 1024, 1280, 1440 px) show no horizontal overflow. Browser checks covered ID search, leakage taxonomy, evidence checklist, local draft, workflow advance/reset/timeline, map views and layer controls, Miami marker/dossier/filter sync, reset and fullscreen/Escape. No JavaScript exceptions or console errors were recorded. OSM tile calls after user-selected map load were intercepted and locally fulfilled by the test harness; no outbound tile request reached the network. Phase 3 implementation commit `016aab34e543d566ced34d88535294f9650220d1` was pushed and its Pages run/public page verified; the current documentation-only follow-up will also receive a deployment check.
