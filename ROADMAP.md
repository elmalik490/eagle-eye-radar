# Roadmap and Safe Next Steps

This roadmap separates prototype improvements already delivered from future product decisions. It does not authorize prospect outreach, access to new data sources, account changes, payments or other external activity.

## Current milestone — static product prototype

The completed interface update preserves the existing one-page GitHub Pages architecture and demonstrates synthetic scenario filtering, assumption-based value bands, explainable heuristic scores, localization/RTL, optional synthetic map layers, and a human-led internal review/draft workflow. It is useful for interface/product conversations only; it is not evidence that a revenue leak exists or that a business will recover revenue.

## Highest-value next product work (ranked)

| Rank | Candidate | Value | Effort | Risk | Gate / decision |
|---|---|---:|---:|---:|---|
| 1 | Validate commercial problem and language with owner-approved, private research; quantify one narrow revenue-leakage workflow and its baseline/denominator | High | Medium | Medium | Scope the batch, privacy boundaries and human approval before any external outreach; do not place private data in this repo. |
| 2 | Specify one lawful, permitted source and an evidence/citation record (source, capture time, scope, uncertainty, retention, correction path) | High | Medium–High | High | Select a source and permission model first; prototype only with clearly authorized/sample data. |
| 3 | Define calibrated scoring from outcomes, with separate signal strength, potential impact, evidence quality and uncertainty; set acceptance metrics | High | High | High | No score should be described as an estimate or validated likelihood until measured and reviewed. |
| 4 | Design secure backend/tenant model, ingestion, durable review/audit history, human approval gates and monitoring | High | High | High | Requires architecture, security/privacy, operational ownership and failure-handling decisions. |
| 5 | Select a production map provider or self-hosted tiles, terms/SLA, costs and capacity | Medium | Medium | Medium | The demo uses public OSM tiles by explicit load only; do not rely on that public endpoint for commercial-scale delivery. |
| 6 | Add CRM or outbound workflow | Medium | Medium–High | High | Only after lawful evidence, recipient scope, exact content, approvals and logging are defined. No messaging is part of this implementation. |

## Not in this milestone

No API/backend, account access, real-data acquisition, public-data scraping, lead list, prospect contact, CRM, automated sending, billing/payment, 3D globe or unattended automation was added. The user must separately authorize and define any future external or irreversible action. Keep sensitive commercial-validation work in the approved private environment.
