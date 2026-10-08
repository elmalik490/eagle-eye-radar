# Known Issues and Limitations

These are prototype boundaries, not production-readiness claims.

## Data, commercial and verification boundaries

All 12 opportunities, IDs, signals, priority bands, value ranges, assumptions, provenance, evidence placeholders, recommendations and map anchors are synthetic fixtures. They do not describe observed businesses, leads, incidents, revenue, verified leakage, a prediction or recoverable value. City anchors are display placements, not company locations. Sector assumptions and priority dimensions have no validated commercial accuracy.

The checklist is a future human-review prompt, not connected evidence. Checking a box, changing stage, marking a local review or writing a draft never verifies a record, authorizes a business decision or executes an action. Workflow history is tab/session state, not a durable or auditable record. No external message, CRM write, business contact, payment or automation is implemented.

The v2 opportunity contract is populated only from local synthetic fixtures. Source freshness and reliability, evidence quality, confidence and false-positive/operational risk are not measured. Priority is a deterministic ranking of synthetic demand/urgency/scope, not probability, model confidence, prediction, actual leakage or recovered revenue. USD values are monthly illustrative scenarios, not observed business figures.

## Geographic data and map tiles

The local world backdrop is a simplified Natural Earth 1:110m derivative, public-domain source data with an attribution/provenance record at [`data/ATTRIBUTION.md`](data/ATTRIBUTION.md). Simplification at world scale omits Antarctica, small islands and fine detail; political boundaries use Natural Earth's general-purpose depiction and are not authoritative legal boundaries. Some small territories may lack a usable ISO country feature, in which case the map falls back to a demo city anchor. The 12 map pins remain fictional public-city anchors, irrespective of the basemap.

The map's default layer is local, but a visitor who explicitly enables optional street tiles requests visible raster tiles from `tile.openstreetmap.org`. Availability, latency and zoom detail depend on that public best-effort service. Standard OSM tile servers are not a commercial SLA, offline cache or high-volume entitlement. No Eagle Eye opportunity/business records are sent with the tile request. Choose a permitted commercial provider or suitable self-hosted map infrastructure before depending on street tiles at scale; continue following the current tile-service usage policy and attribution requirements.

## Browser and engineering limits

The app is static and anonymous. It has no source connectors, backend, database, tenant boundary, server-side authorization, secrets management, durable review state, retention policy, rate limiting, monitoring or failure queue. Workflow event history uses `sessionStorage` and may be cleared; language preference uses browser-local storage. Both are browser-local and not authoritative.

The Phase 4.2 Playwright/Chromium smoke script was run from `/tmp` and is not committed as a CI regression suite. Local checks covered seven viewport widths, six languages, key list/dossier/workflow/map controls, no initial external request and an intercepted optional tile request. They are not a formal WCAG review, screen-reader assessment, accessibility certification, security review, performance budget, native mobile test or cross-browser certification. Translation keys/UI presence checks do not substitute for native-speaker and market-specific terminology review.

Before any real-data or automated work, decide lawful/authorized source access, evidence/provenance, privacy and retention, correction/removal, source quality, tenant and operational security, calibration and acceptance measures, durable human approval/audit, error handling and commercial tile terms. Do not put prospects or private commercial-validation records in this public repository.
