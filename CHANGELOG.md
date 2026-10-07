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
