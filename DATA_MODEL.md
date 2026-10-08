# Opportunity data contract — v3 (synthetic adapter)

The interface consumes a versioned opportunity shape so a future, explicitly authorized source adapter can be considered without redesigning the dossier. In this release, `toOpportunityContract()` maps only pre-authored local fictional examples. It does **not** connect to or imply a real source.

## Shape

```text
{
  schemaVersion: 3,
  id: string,                           // synthetic fixture id
  identity: {
    location: { cityId, countryCode, regionId, precision: "public_city_anchor" },
    sector: string,
    opportunityType: string,
    detectedAt: null,                   // no detection occurred
    description: "synthetic_pre_authored_example_not_a_real_detection"
  },
  signal: {
    category: string,
    description: "fictional_process_pattern",
    strength: { value: null, status: "not_measured" }
  },
  evidence: {
    available: [],
    missing: ["authorized_primary_source", "corroborating_source",
              "defined_scope_and_denominator", "confirmed_outcome"],
    quality: { value: "not_assessed", basis: "synthetic_demo_only" },
    verificationStatus: "unverified",
    stateVocabulary: ["FACT", "VERIFIED", "LIKELY", "HYPOTHESIS", "UNVERIFIED", "CONFLICTING"],
    claims: [
      { id: "workflow-pattern", subject: "potential_process_gap", state: "HYPOTHESIS", evidenceIds: [] },
      { id: "business-event", subject: "observed_business_event", state: "UNVERIFIED", evidenceIds: [] },
      { id: "value-outcome", subject: "recovered_value", state: "HYPOTHESIS", evidenceIds: [] }
    ]
  },
  interpretation: {
    status: "hypothesis_only", confidence: null,
    explanation: "General pattern context is separate from evidence of any real event."
  },
  valueScenario: {
    currency: "USD", period: "month", low: number, high: number,
    model: "illustrative_assumptions_only",
    assumptions: {
      prospects: [low, high], ticket: [low, high],
      recoverableShare: [low, high], geographicAdjustment: 0
    }
  },
  priority: {
    score: number, band: "low | medium | high", scale: 100,
    model: "deterministic_demo_sort_only",
    weights: { demand: 0.45, urgency: 0.30, scope: 0.25 },
    dimensions: { demand: number, urgency: number, scope: number }
  },
  freshness: {
    status: "fixed_demo_dataset", observedAt: null,
    sourceFreshness: "not_applicable_no_live_source"
  },
  verificationStatus: "unverified",
  provenance: {
    source: "Local synthetic fixture",
    status: "DEMO / SYNTHETIC / NOT REAL",
    collectionDate: null,
    coverage: "13 fictional city anchors across seven world regions",
    freshness: "no observed time window",
    reliability: "not_assessed",
    permissionStatus: "locally authored fictional examples; no business source accessed",
    evidenceType: "synthetic scenario"
  },
  risk: {
    dataUncertainty: "entirely_synthetic",
    falsePositiveRisk: "not_assessed",
    operationalRisk: "not_assessed"
  },
  recommendation: {
    actionKey: "reviewAgainstAuthorizedEvidence",
    requiresHumanApproval: true,
    externalActionEnabled: false
  },
  workflowStage: string,                // local session UI only
  timestamps: { workflowSessionOnly: true }
}
```

## Semantics and limits

`detectedAt` is `null` because these records were not detected. The city location is a public city anchor only. Signal strength is null/not measured, evidence is empty, and evidence quality, source reliability, confidence, and business loss are not assessed. `collectionDate` is null; the dataset is fixed synthetic content, not a source observation window.

Claim-state vocabulary is descriptive, not an evidence generator. The current fixtures label a potential process pattern and hypothetical value outcome as `HYPOTHESIS`; a claimed real business event is `UNVERIFIED`. Every claim has an empty evidence reference list. These states remain separate from `verificationStatus`, priority, and local workflow stage.

The monthly USD range is calculated locally from hypothetical sector prospect counts, ticket values, and recoverable-share assumptions. `geographicAdjustment` is zero; a city name or real map boundary does not increase the amount. The range is not a measurement, quote, forecast, or recovered revenue.

Priority is a deterministic sorting heuristic over pre-authored fixture values: demand 45%, urgency 30%, scope 25%. The dimensions are explicitly demo. The number/band is not a probability, calibrated likelihood, estimate of leakage, or confidence. Evidence quality is not included in the score because evidence does not exist.

Workflow stage is separate from `verificationStatus`. Moving to “Qualified,” “Action Ready,” or “Resolved” changes only local session UI state. It never verifies evidence, records a business decision, or enables an external action. `DemoWorkflow` uses `sessionStorage`; it is not a durable audit log.

The bundled Natural Earth map boundaries are geographic display data, not an opportunity feed. Optional OSM raster tiles are likewise basemap context and are requested only after explicit opt-in. No opportunity or business data is sent to either map source.

Future connectors must not be attached until permission, source provenance/access scope, privacy, retention, correction/removal, tenant isolation, operational security, source quality, calibration, review, and approval requirements are independently decided. Keep prospect or private-source records out of this public repository.
