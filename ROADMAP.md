# Roadmap and Safe Next Steps

This roadmap separates the current synthetic product foundation from future product decisions. It does not authorize prospect outreach, new source access, payments, account changes or other external activity.

## Current milestone — Phase 4.2 World Radar foundation

The existing one-page GitHub Pages app now has a local world-boundary backdrop, 12 synthetic city anchors, selectable map scopes, synchronized search/list/dossier, compact mobile-first map presentation, six localized languages and Arabic RTL. The versioned v2 opportunity shape separates evidence and verification from hypotheses, scenario assumptions and demo ranking. Raster OSM tiles remain an explicit user opt-in. Product code commit `5e1ba8afd50a609bf80886b03549f4ec16219b97` is deployed by successful Pages run [37724305759](https://github.com/elmalik490/eagle-eye-radar/actions/runs/37724305759); public resources and the rendered map were checked against the commit. This remains a UI and architecture prototype; it does not demonstrate real leakage or recoverable money.

## Highest-value next work (ranked)

| Rank | Improvement | Value | Effort | Risk | Safe first step |
|---:|---|---|---|---|---|
| 1 | Validate one narrow revenue-leakage job-to-be-done and its baseline/outcome using owner-approved, private, consented records | High | Medium | Low–Medium | Agree on a single workflow, denominator, time window, exclusions and success/false-positive measure before processing data; keep private records outside this public repository. |
| 2 | Select one lawful, permitted real source and specify its evidence/connector contract | High | Medium–High | High | Decide permission, provenance, IDs/citations, observation time, scope, uncertainty, correction/removal, retention and access first; prototype with synthetic or explicitly approved sample data. |
| 3 | Evaluate and calibrate priority against human-reviewed outcomes | High | High | High | Define labels, time horizon, holdout, review-yield/precision targets and how evidence strength, potential impact and uncertainty stay separately visible before changing score weights. |

## Later production foundations

A backend, authentication and tenant isolation, access controls, durable evidence/approval/audit history, privacy/retention, monitoring, job failure handling and constrained automation are necessary before multi-user/real-data use. Select permitted map infrastructure with appropriate terms, reliability, capacity and cost before commercial-scale use. CRM or outbound action comes only after authorized evidence, exact scope/content and explicit approval gates are designed. None of these production integrations is part of the current milestone.
