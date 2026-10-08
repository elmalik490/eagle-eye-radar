# Known Issues and Limitations

These are prototype boundaries, not production-readiness claims.

## Data, commercial and verification boundaries

All nine opportunities, scores, ranges, priority bands, provenance, evidence placeholders and geographic overlays are generated from local fictional fixtures. They are not observed businesses, leads, incidents, historical revenue, verified leakage, predictions or evidence of recoverable value. City anchors are not business locations. Ticket sizes, leads, recovery shares, city multipliers and priority dimensions are illustrative and have no validated commercial accuracy. The optional map's real streets and place labels offer context only; they are not support for its synthetic intelligence layer.

The evidence checklist is a prompt for future human review, not connected source evidence. Checking a box never verifies a record. Workflow stage and verification status are separate: even Qualified, Action Ready or Resolved session state never means the record is verified, approved or executed. The event timeline, reviewed label, editable note and filters are client-side UI behavior—not formal approval, durable history or an audit record. No business contact, CRM write, automation, external send or payment is implemented.

## Data contract and score semantics

The v1 opportunity contract is an adapter shape only. It is populated from the demo fixture and has no real-source connector. Source freshness, evidence quality, reliability and operational/false-positive risk are not measured. The score is a deterministic scenario-ranking heuristic with synthetic inputs—not a probability, model confidence, prediction or expected recovery. Displayed dollar ranges are hypothetical monthly scenario calculations, not observed or recoverable revenue. See [`DATA_MODEL.md`](DATA_MODEL.md).

## Map dependency

Leaflet and application assets are bundled locally. If a visitor deliberately loads the interactive map, visible raster tiles are fetched from `tile.openstreetmap.org`. Tile availability, latency and zoom detail depend on that public best-effort service. OSM standard tile servers are not a production SLA, offline cache, high-volume entitlement or recommended commercial-scale foundation. Choose a permitted map provider or suitable self-hosted infrastructure before relying on it commercially, and follow the provider's current attribution/caching/usage policy. Basemap tile access is separate from intelligence data; Eagle Eye opportunity and business records are not sent to OSM.

## Browser and engineering limits

The app is static and anonymous. It has no source connectors, backend, database, tenant separation, server-side authorization, secrets management, durable review state, data-retention policy, rate limiting or monitoring. The workflow event log uses `sessionStorage` and may be cleared at tab/session end; language preference uses browser-local storage. Neither is shared, durable or authoritative. Storage may be blocked or unavailable.

The local Playwright/Chromium checks cover seven viewport widths, six UI languages and the main fixture/map/workflow flows, but are not a committed CI regression suite, formal WCAG audit, screen-reader assessment, security review, performance budget or cross-browser certification. The public deployment remains the previous baseline until the current Phase 3 changes are pushed and the exact Pages run is confirmed. Translation completeness checks do not replace review by native speakers or market-specific terminology validation.

Before real-data or automated work, define lawful/authorized access, source evidence/provenance, privacy and retention, correction/removal paths, source quality, tenant and operational security, calibrated scoring, acceptance metrics, human approval/audit controls, error handling and commercial tile-provider terms. Do not put prospects or private commercial-validation records in this public repository.
