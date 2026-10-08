# Roadmap and Safe Next Steps

This roadmap separates the shipped static-product foundation from future product decisions. It does not authorize prospect outreach, access to new data sources, account changes, payments or other external activity.

## Current milestone — Phase 3 product/workflow foundation

The existing one-page GitHub Pages app now has an opportunity contract, evidence-first dossier, heuristic-score explanation, data-readiness separation, leakage taxonomy, local session pipeline and audit-style timeline, a six-language command center, and a synchronized synthetic opportunity map. This is a UI and architecture prototype only; it does not demonstrate that leakage exists or that a business can recover money. The Phase 3 changes must still be committed and the exact Pages deployment verified before they are called live.

## Highest-value next work (ranked)

| Rank | Improvement | Value | Effort | Risk | Safe first step |
|---|---|---|---|---|---|
| 1 | Validate one narrow revenue-leakage job-to-be-done and baseline using owner-approved, private, consented internal records; define a concrete success and false-positive measure | High | Medium | Low–Medium | Agree on one use case, denominator, time window and fields before sharing or processing any private data; keep that data outside this public repository. |
| 2 | Choose one lawful, permitted real source and specify its connector/evidence contract: source IDs/citations, observation time, scope, uncertainty, correction/removal, retention and permissions | High | Medium–High | High | Make source and authorization decisions first; use a mock adapter or a sample explicitly approved for testing until then. |
| 3 | Calibrate and evaluate opportunity priority against reviewed outcomes, keeping signal strength, potential impact, evidence quality and uncertainty separately visible | High | High | High | Define labeled outcomes, time horizon, acceptable precision/recall or review yield, and a human-reviewed holdout before changing a score. |

## Later production foundations

A secure backend, identity and tenant isolation, access controls, durable approval/audit history, retention/removal, monitoring, job failure handling and constrained automation are necessary before multi-user/real-data use. A production tile provider or self-hosted basemap must be selected with allowed terms, reliability, capacity and cost before commercial-scale reliance. CRM or outbound action comes only after reviewed evidence, scope, exact content and approval gates are designed. No such work or outreach is part of this milestone.
