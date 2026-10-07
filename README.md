# EAGLE EYE — Opportunity Radar

Eagle Eye is a **static v0.1 prototype** for demonstrating an opportunity-radar interface. It currently displays synthetic demo values; it does not discover real businesses, verify real operational signals, or recover revenue.

## Live prototype

- GitHub Pages: <https://elmalik490.github.io/eagle-eye-radar/>
- Repository: <https://github.com/elmalik490/eagle-eye-radar>
- Default branch: `main`
- Product-code baseline: `87b73085c07161d5a87e680d06f43dc9136a9bc3` (`Deploy Eagle Eye Opportunity Radar v0.1 prototype`)

## Current state

The page is a single `index.html` with location and sector selectors, a scan interaction, an opportunity card, a Verify panel, and an Act/Draft panel. Every displayed opportunity value is explicitly marked `DEMO / SYNTHETIC`; status is `UNVERIFIED`. The approval control is demo-only and does not send a message.

This is **not production software** and has no backend, database, live data source, CRM integration, real verification pipeline, or external outreach capability. See [PROJECT_STATUS.md](PROJECT_STATUS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [KNOWN_ISSUES.md](KNOWN_ISSUES.md), [ROADMAP.md](ROADMAP.md), and [HANDOVER.md](HANDOVER.md).

## Run locally

No build step is required. Open `index.html` in a browser, or run a local static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>. The page loads Tailwind CSS from its public CDN, so styling requires internet access.

## Repository contents

- `index.html` — the prototype UI and inline interaction logic.
- `.github/workflows/pages.yml` — deploys the repository root to GitHub Pages on pushes to `main` and on manual dispatch.
- Root Markdown files — sanitized project status and handover documentation.

## Privacy boundary

A private commercial-validation batch exists outside this public repository. It is intentionally excluded from GitHub and from these documents. Do not add prospect identities, contact details, private research, or private spreadsheet contents to this public repository.
