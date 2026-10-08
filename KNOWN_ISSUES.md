# Known Issues and Limitations

These are prototype boundaries, not promises of production readiness.

## Data, commercial and verification boundaries

All nine opportunity scenarios, scores, ranges and geographic overlays are generated from local fictional fixtures. They are not observed businesses, leads, incidents, historical revenue, verified leakage, predictions or evidence of recoverable value. The city-level anchors are not business locations. Score weights, ticket sizes, leads, recovery shares and city multipliers are illustrative assumptions and have no validated commercial accuracy. The map's real streets and place labels provide geographic context only; they must not be confused with the synthetic Eagle Eye layer.

The evidence checklist is a prompt for a human-led future review and is not connected to source evidence. Checking a box never verifies a scenario or alters its `UNVERIFIED` status. “Mark reviewed,” the editable note, copy action, filters and session history are client-side page behavior, not an approval/audit record. No external contact, messaging, CRM, automation or persistence is enabled.

## Map dependency

The locally bundled Leaflet library and other application assets are hosted with this site. If a user deliberately loads the interactive map, visible raster tiles are fetched from `tile.openstreetmap.org`; tile availability, latency and zoom detail depend on that public best-effort service. OSM's standard tile servers are not a production SLA, offline cache, high-volume entitlement, guaranteed service, or recommended basis for commercial scale. Choose a suitable commercial provider or self-hosted infrastructure before relying on the map commercially, and observe the provider's current attribution, caching and usage requirements. This map-tile request is separate from any intelligence data; no Eagle Eye opportunity or business record is sent to the tile provider.

## Engineering limits

The page is static and anonymous. It has no source connectors, backend, database, tenant separation, server-side authorization, secrets management, audit/policy enforcement, durable review state, data-retention policy, rate limiting or monitoring. `localStorage` availability depends on the browser. The lightweight tests cover seven viewport sizes and a few flows; there is no committed automated regression suite, formal WCAG audit, performance budget or cross-browser certification. Translation keys are covered for the rendered interface, but content and market-specific localization require human review.

Before any real-data or automated phase, define evidence provenance, lawful/authorized access, privacy and retention, source quality, operational security, tenant boundaries, calibrated scoring, confidence semantics, human approval/audit controls and measurable acceptance criteria. No prospects or private commercial-validation records belong in this public repository.
