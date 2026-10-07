# Changelog

## 2026-10-08 — Documentation handover checkpoint

- Added sanitized README, project status, architecture, roadmap, known-issues, changelog, and handover documentation.
- Preserved the existing `index.html` and `.github/workflows/pages.yml` without changes.
- Re-ran the live browser smoke test for all three requested location/sector flows, Verify, Act, and the local-only approval alert. All checks passed; no JavaScript errors or monitored external send calls were observed.
- Excluded all private prospect/contact data and private research from the public repository.

## 2026-10-07 — v0.1 static demo prototype

- Added the single-page Opportunity Radar demo and GitHub Pages Actions workflow.
- Product-code baseline commit: [`87b73085c07161d5a87e680d06f43dc9136a9bc3`](https://github.com/elmalik490/eagle-eye-radar/commit/87b73085c07161d5a87e680d06f43dc9136a9bc3).
- Published through GitHub Pages; the deployment run recorded success for the product-code baseline.
- The demo uses synthetic, unverified, hard-coded content. No real data services or outbound communications were added.

## 2026-10-08 — v0.1 workflow and explainability upgrade
- Preserved the existing static single-page prototype and GitHub Pages deployment; replaced external Tailwind runtime dependency with responsive self-contained CSS.
- Replaced unsupported revenue-at-risk/confidence claims with synthetic assumption-based monthly scenario ranges and a visible formula.
- Added sector-specific illustrative assumptions and transparent weighted demo priority score; neither is evidence, forecast, or real opportunity estimate.
- Added an authorized human evidence-review checklist that leaves the demo status UNVERIFIED, plus editable/copyable internal-only next-step draft and local review state.
- Improved mobile touch targets, keyboard focus, live status announcements, reduced-motion behavior, and explicit no-data/no-send guardrails.
- No backend, network data source, business lookup, outbound messaging, or external action was added.
