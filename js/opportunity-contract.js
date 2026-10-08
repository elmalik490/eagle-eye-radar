// Versioned adapter shape: populated only from local, pre-authored synthetic examples in this release.
export function toOpportunityContract(record,scored,workflowStage='detected'){
  const {city,sector,low,high,dimensions,score,priorityBand,weights,assumptions}=scored;
  return {
    schemaVersion:2,
    id:record.id,
    identity:{location:{cityId:city.id,countryCode:city.countryCode,regionId:city.regionId,precision:'public_city_anchor'},sector:record.sector,opportunityType:record.type,detectedAt:null,description:'synthetic_pre_authored_example_not_a_real_detection'},
    signal:{category:record.type,description:'fictional_process_pattern',strength:{value:null,status:'not_measured'}},
    evidence:{available:[],missing:['authorized_primary_source','corroborating_source','defined_scope_and_denominator','confirmed_outcome'],quality:{value:'not_assessed',basis:'synthetic_demo_only'},verificationStatus:'unverified'},
    interpretation:{status:'hypothesis_only',confidence:null,explanation:'General pattern context is separate from evidence of any real event.'},
    valueScenario:{currency:'USD',period:'month',low,high,model:'illustrative_assumptions_only',assumptions:{prospects:assumptions.prospects,ticket:assumptions.ticket,recoverableShare:assumptions.recoverable,geographicAdjustment:0}},
    priority:{score,band:priorityBand,scale:100,model:'deterministic_demo_sort_only',weights,dimensions},
    freshness:{status:'fixed_demo_dataset',observedAt:null,sourceFreshness:'not_applicable_no_live_source'},
    verificationStatus:'unverified',
    provenance:{source:'Local synthetic fixture',status:'DEMO / SYNTHETIC / NOT REAL',collectionDate:null,coverage:'12 public city anchors across six broad world regions',freshness:'no observed time window',reliability:'not_assessed',permissionStatus:'locally authored fictional example; no business source accessed',evidenceType:'synthetic scenario'},
    risk:{dataUncertainty:'entirely_synthetic',falsePositiveRisk:'not_assessed',operationalRisk:'not_assessed'},
    recommendation:{actionKey:'reviewAgainstAuthorizedEvidence',requiresHumanApproval:true,externalActionEnabled:false},
    workflowStage,
    timestamps:{workflowSessionOnly:true}
  };
}
