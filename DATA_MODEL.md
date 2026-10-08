# Opportunity data contract — v1 (demo adapter)

The interface consumes one normalized opportunity shape so a future, explicitly authorized source adapter can be considered without redesigning the dossier. In this phase, `toOpportunityContract()` maps only the nine local synthetic fixtures. The contract describes fields; it does **not** connect or imply a real source.

## Shape

```text
{
  schemaVersion: 1,
  id: string,                         // stable demo record id
  identity: {
    location: { cityId, cityName, country, precision: "city_anchor" },
    sector: string,
    opportunityType: string,
    detectedAt: ISO timestamp,        // browser-session fixture generation time
    detectionContext: "synthetic_session_generation_not_a_real_detection"
  },
  signal: {
    category: string,
    descriptionKey: string,
    strength: { value: null, status: "not_measured" }
  },
  evidence: {
    available: [],                    // deliberately empty; no evidence is invented
    missing: [source/corroboration/scope requirements],
    quality: { value: "not_assessed", basis: "synthetic_demo_only" }
  },
  valueScenario: {
    currency: "USD", period: "month", low: number, high: number,
    model: "illustrative_assumptions",
    assumptions: { tickets, leads, recoverableShare, cityMultiplier }
  },
  priority: { score, scale: 100, model: "heuristic_demo", weights, dimensions },
  freshness: { value: "demo_session", observedAt: null, sourceFreshness: "not_applicable" },
  verificationStatus: "unverified",
  provenance: {
    source: "Synthetic Demo Dataset", status: "DEMO / NOT REAL",
    collectionDate: ISO session-generation timestamp,
    coverage, freshness, reliability, permissionStatus, evidenceType
  },
  risk: {
    dataUncertainty: "high_synthetic_only",
    falsePositiveRisk: "not_assessed",
    operationalRisk: "not_assessed"
  },
  recommendation: { actionKey, requiresHumanApproval: true, externalActionEnabled: false },
  workflowStage: "detected | review | verification | qualified | actionReady | resolved",
  timestamps: { sessionStartedAt: ISO timestamp }
}
```

## Semantics and limits

`detectedAt` and `collectionDate` mean that a synthetic fixture was composed for the current browser session; they do not describe a real-world signal or source collection. The city location has city-anchor precision only. Signal strength is null/not measured. Evidence available is empty. Evidence quality, source reliability, false-positive risk and operational risk are not assessed. Data uncertainty is called high because the record is wholly synthetic, not because a measured confidence interval exists.

The displayed priority is a deterministic **demo sorting heuristic**, not a probability, validated likelihood, or estimate of recovery. It uses synthetic demand, illustrative scenario scale and synthetic urgency weights (35%, 40%, 25%); it deliberately excludes evidence quality because no source evidence exists. Evidence quality, data freshness and verification status appear separately.

Workflow `stage` is separate from `verificationStatus`. Moving a synthetic record to “Qualified,” “Action ready,” or “Resolved” changes only browser session state and never verifies evidence, records a business decision, or enables an external action. `DemoWorkflow` stores only synthetic stage/event state under `sessionStorage` for the current tab/session; storage may be unavailable and is not a durable audit log.

Future connectors must not be attached until permission, source provenance, access scope, retention, privacy/security, correction, review, calibration and operational requirements are independently decided. Do not put prospect or private-source records in this public repository.
