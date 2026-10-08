# Project Status

**Checked:** 2026-10-08 · **Stage:** Phase 3 local implementation on the retained static GitHub Pages architecture; pending commit/push/deployment verification. This remains an unvalidated synthetic prototype, not production revenue-recovery software.

## Implemented in the current working tree

The existing one-page entry point and publishing workflow remain in place. The six-language responsive command center now searches stable opportunity IDs and presents a separate structured dossier for identity, synthetic signal, interpretation, illustrative value assumptions, evidence availability/gaps, provenance, heuristic priority/dimensions, freshness, verification state, risks and recommendation. Evidence quality is excluded from the priority heuristic and shown as not assessed. A local six-stage opportunity workflow, counts and timestamped event timeline are stored per browser tab/session; stage state does not change `UNVERIFIED`. Editable internal-only draft behavior and human-approval guardrails remain.

A revenue-leakage taxonomy distinguishes fixture-backed synthetic signal categories from concept-only categories. The optional Leaflet map keeps its explicit load action and OSM attribution and now supports city selection/dossier sync, priority/selection cues, and illustrative leakage, demand, verification and risk layers. The data-readiness view lists prospective source classes individually as **NOT CONNECTED**. Arabic RTL and the six translation dictionaries cover the new UI. The v1 contract and its limits are documented in [`DATA_MODEL.md`](DATA_MODEL.md).

## DEMO / SYNTHETIC boundary

All nine opportunities, signals, IDs, priority/dollar values, assumed ranges, provenance, map overlays and local workflow history are fictional/demo artifacts. No real business discovery, connected evidence, CRM, API, database, calibrated score or external action exists. OSM is only optional basemap context. The displayed heuristic uses synthetic demand (35%), illustrative scenario scale (40%) and synthetic urgency (25%); evidence quality is excluded and not assessed. High synthetic uncertainty is not a measured confidence value.

## Local verification completed

Playwright with Chromium exercised the local page at **360, 390, 430, 768, 1024, 1280 and 1440 px**; neither document nor body overflowed horizontally. The initial render showed nine demo records and six pipeline stages. All six translation dictionaries had matching keys, no rendered interface key was missing, and Arabic used RTL while the other five languages used LTR.

Search by `phoenix-hvac` returned one record. The missed-calls taxonomy filtered to its three synthetic examples. Selecting a checklist item left the opportunity `UNVERIFIED`; local stage advance reached Review, terminal Resolved and reset to Detected; the audit-style timeline rendered; the internal draft was editable and marked not for external action. The explanatory demo dialog opened and closed.

Map testing checked World/Country/City controls, all three city markers, six layer controls, Miami-marker-to-dossier/filter synchronization, city selection, map reset, full-screen and Escape-to-exit. No map tile request occurred before opt-in. During this Phase 3 test, **all** OpenStreetMap tile requests after opt-in were intercepted and locally fulfilled by Playwright; none reached an external network. Browser JavaScript exceptions: **0**. Console errors: **0**.

Screenshots are local test artifacts; map imagery in that test is intentionally synthetic/blank because outbound OSM tile requests were intercepted. The screenshots are not deployment assets.

## Commit and live deployment

The current working tree has not yet been committed. The last deployed baseline is `b1c753d47425fa6e5a2088a2f56102fa05f79d86`; GitHub Pages currently reflects that previous phase, not these Phase 3 changes. After the Phase 3 commit is pushed, verify the exact commit's GitHub Actions Pages run and the public URL before calling this phase live.

## Remaining limits

The browser test is currently a local reproducible script under `/tmp` rather than a committed CI suite. There is no formal accessibility, cross-browser, security or performance audit. Session workflow data is ephemeral and not an approval/audit record. Real-data access, source authorization, retention, privacy/security, tenant separation, outcome calibration and production tile-provider decisions remain open; see [`KNOWN_ISSUES.md`](KNOWN_ISSUES.md) and [`ROADMAP.md`](ROADMAP.md).
