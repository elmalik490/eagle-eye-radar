// Static adapter contract: shaped for future permitted providers, but fed only by local synthetic fixtures today.
export function toOpportunityContract(record, scored, sessionStartedAt, workflowStage='detected') {
  const {city,sector,low,high,dimensions,score}=scored;
  return {
    schemaVersion: 1,
    id: record.id,
    identity: {
      location: {cityId:city.id,cityName:city.name,country:city.country,precision:'city_anchor'},
      sector: record.sector,
      opportunityType: record.type,
      detectedAt: sessionStartedAt,
      detectionContext: 'synthetic_session_generation_not_a_real_detection'
    },
    signal: {
      category: record.type,
      descriptionKey: record.signalKey,
      strength: {value:null,status:'not_measured'}
    },
    evidence: {
      available: [],
      missing: ['authorized_primary_source','corroborating_source','defined_scope_and_denominator'],
      quality: {value:'not_assessed',basis:'synthetic_demo_only'}
    },
    valueScenario: {
      currency: 'USD', period: 'month', low, high, model: 'illustrative_assumptions',
      assumptions: {tickets:sector.ticket,leads:sector.leads,recoverableShare:sector.recovery,cityMultiplier:city.multiplier}
    },
    priority: {score,scale:100,model:'heuristic_demo',weights:scored.weights,dimensions},
    freshness: {value:'demo_session',observedAt:null,sourceFreshness:'not_applicable'},
    verificationStatus: 'unverified',
    provenance: {
      source:'Synthetic Demo Dataset',status:'DEMO / NOT REAL',
      collectionDate:sessionStartedAt,coverage:'synthetic city-sector fixtures only',
      freshness:'session-generated fixture; not source freshness',reliability:'not_assessed',
      permissionStatus:'local synthetic fixture; no external source accessed',evidenceType:'synthetic scenario placeholder'
    },
    risk: {dataUncertainty:'high_synthetic_only',falsePositiveRisk:'not_assessed',operationalRisk:'not_assessed'},
    recommendation: {actionKey:record.actionKey,requiresHumanApproval:true,externalActionEnabled:false},
    workflowStage,
    timestamps: {sessionStartedAt}
  };
}
