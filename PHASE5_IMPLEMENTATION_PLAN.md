# Phase 5 — 3D Globe + Cybernetic Command HUD

**Baseline inspected:** clean `main` at `508fa3d8d6dfbe07e0c5f053082af9c66cc7b254`, synchronized with `origin/main`. Existing one-page GitHub Pages app, Leaflet fallback, 12 synthetic city anchors, six-language dictionaries, local v2 opportunity contract, and review/draft boundaries were the base. No preview server was listening.

This is a visualization experiment only. No real data, LSA account access, business discovery/contact, SMS/email/calls, customer-record processing, CRM, payment, subscription, backend, or automated action is in scope. Commercial validation remains 0 conversations, 0 paid pilots, 0 proof of value unless an explicitly approved future activity changes that.

## Ranked implementation plan

| Rank | Improvement | Value | Effort | Risk | Acceptance target / result |
|---:|---|---|---|---|---|
| 1 | Add a responsive interactive 3D Earth using the existing local Natural Earth geometry and fictional city anchors. Vendor Three.js locally with its MIT notice so runtime requires no CDN or new service. | Very high | High | Medium (bundle size/WebGL capability) | **PASS:** Three.js r186 local files; pointer/touch rotation and zoom, selectable synthetic markers, same-origin runtime assets only. |
| 2 | Keep Leaflet as explicit 2D mode and automatic WebGL fallback. Handle renderer failure/context loss, provide a visible 2D control, pause hidden/reduced-motion rendering, cap pixel ratio, and trim effects on smaller devices. | Very high | Medium | Medium | **PASS:** WebGL2-unavailable and context-loss tests reached Leaflet; selected record and app state remained usable. Sustained-low-FPS fallback is implemented; no physical low-end Android claim. |
| 3 | Add a numbered 1–6 command lifecycle HUD, visibly separating DEMO, HYPOTHESIS, UNVERIFIED, VERIFIED, and CONFLICTING states. No stage should imply verification/decision/execution occurred. | High | Medium | Low | **PASS:** six numbered steps render; EXECUTE is non-actionable/disabled; six languages and Arabic RTL. |
| 4 | Reframe the dossier around signal/location, hypothetical problem, disconnected-AI disclosure, and a three-step Business Blueprint; preserve assumptions, unverified evidence, local review, and editable internal draft. | High | Medium | Low | **PASS:** three-step Blueprint and synthetic disclaimers present; existing dossier/checklist/draft remain functional. No LSA-policy, industry-average, conversion, ROI, or revenue claim added. |
| 5 | Extend the opportunity contract for claim-level epistemic states while representing current records as synthetic hypotheses with empty evidence. | High | Medium | Medium | **PASS:** v3 adds six-state vocabulary; fixture claims are HYPOTHESIS/UNVERIFIED with no evidence references, separate from workflow/priority. |

## Design and engineering constraints

- Preserved `index.html`, static Pages, current filters/list/dossier, all six locales, synthetic fixtures, and Leaflet as fallback. No framework rewrite.
- Generated the globe equirectangular land texture from bundled Natural Earth GeoJSON; no external image or globe API.
- Added the fictional Dubai/Middle East city anchor; the fixed fixture set now totals **13 anchors across seven regions**.
- Used a restrained low-power scene: textured sphere, subtle grid/atmosphere, radar rings, and markers; no particle field, post-processing, or external assets.
- On mobile, the map/globe is first in content order and its stage targets about **68svh** below 768px. Pixel ratio is capped, auto-rotation pauses for reduced motion/hidden tab and can be manually paused; drawer state synchronizes across resize.
- FPS is a target, not a guarantee. One 360×640 headless Chromium/SwiftShader sample observed 264 animation callbacks over four seconds (about 66/s); this is not a physical mobile benchmark. The renderer degrades effects/falls back if sustained performance is very low.
- No commercial-validation claims or universal vendor benchmark, LSA applicability, conversion, recovered revenue, or ROI introduced.

## Validation completed locally

- Playwright/Chromium: **360, 390, 430, 768, 1024, 1280, 1440px**; no horizontal document/body overflow; globe stage about 68% of phone viewport height. Fresh 360×640 and 390×844 loads placed the globe first and kept the closed filter drawer off-canvas/inert.
- Six languages checked at 360px; Arabic direction was RTL; no horizontal overflow.
- 13 markers and seven regions; list/map/dossier selection, direct 3D marker selection, 2D/3D toggle, filters/reset, pause/zoom, local review/draft boundaries exercised.
- WebGL2-unavailable and forced context-loss fallback both reached Leaflet.
- Browser requests were same-origin only by default; optional OSM tiles were not enabled. Console errors: 0; page errors: 0.
- JavaScript syntax and `git diff --check` passed.

These are local prototype checks, not formal WCAG/screen-reader, security, physical-mobile, comprehensive performance, or cross-browser audits.

**Plan state:** implementation and local acceptance complete. GitHub `main` push, Pages workflow, and live deployed-page/assets verification remain to be recorded in [`PROJECT_STATUS.md`](PROJECT_STATUS.md).

## Mobile gesture and palette acceptance

A touch-enabled Chromium run sent a single-finger drag and a two-finger pinch at 390×844; the drag paused auto-rotation and the pinch changed 62,284 rendered pixels, with no page errors. The interface palette is Electric Cyan `#00f0ff`, Emerald `#10b981`, Purple `#a855f7`, Gold `#eab308`, Royal Blue `#3b82f6`, and Shield Cyan `#06b6d4`.
