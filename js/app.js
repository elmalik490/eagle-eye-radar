import { cities, sectors, demoRecords, types } from './demo-data.js';
import { scenarioFor, money } from './scoring.js';
import { translations, getLanguage, applyLanguage } from './i18n.js';
import { OpportunityMap } from './map-view.js';
import { toOpportunityContract } from './opportunity-contract.js';
import { DemoWorkflow, workflowStages } from './demo-workflow.js';

let lang=getLanguage();
let t=applyLanguage(lang);
let selectedId='phoenix-hvac';
let filtered=[];
let history=[];
let mapController=null;
let mapTileErrors=0;
let mapView='city';
const sessionStartedAt=new Date().toISOString();
const workflow=new DemoWorkflow(demoRecords.map(record=>record.id),sessionStartedAt);
const $=id=>document.getElementById(id);
const typeKey={missedCalls:'typeMissedCalls',unansweredLeads:'typeUnansweredLeads',serviceDemand:'typeServiceDemand'};
const priorityKey={high:'priorityHigh',medium:'priorityMedium',low:'priorityLow'};
const cityKey={phoenix:'cityPhoenix',miami:'cityMiami',houston:'cityHouston'};
const sectorKey={hvac:'sectorHvac',plumbing:'sectorPlumbing',roofing:'sectorRoofing'};
const scoreLabels={demand:'demand',revenue:'revenue',urgency:'urgency'};
const stageLabels={detected:'stageDetected',review:'stageReview',verification:'stageVerification',qualified:'stageQualified',actionReady:'stageActionReady',resolved:'stageResolved'};
const leakageCategories=[
  {key:'categoryMissedCalls',type:'missedCalls'},
  {key:'categoryAbandonedQuotes'},
  {key:'categoryUnansweredLeads',type:'unansweredLeads'},
  {key:'categoryUnfollowedEstimates'},
  {key:'categoryInactiveCustomers'},
  {key:'categoryLostRepeat'},
  {key:'categoryUnderusedAssets'},
  {key:'categoryOperationalWaste'}
];
function cityName(city){return t[cityKey[city.id]]||city.name;}
function sectorName(id){return t[sectorKey[id]]||sectors[id].label;}
function recordScore(record){return scenarioFor(record);}
function contractFor(record){return toOpportunityContract(record,recordScore(record),sessionStartedAt,workflow.getStage(record.id));}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function formatDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?t.notAssessed:new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeStyle:'short'}).format(date);}
function addHistory(key,detail='') {history.unshift({key,detail,at:new Date().toISOString()});renderHistory();}
function initFilters(){const select=$('locationFilter');for(const city of cities){const opt=document.createElement('option');opt.value=city.id;opt.textContent=cityName(city);select.append(opt);}}
function filteredRecords(){
  const q=$('searchFilter').value.trim().toLocaleLowerCase(lang);
  return demoRecords.filter(record=>{
    const city=cities.find(item=>item.id===record.cityId);
    const humanId=`ee-demo-${record.cityId}-${record.sector}`;
    const haystack=`${record.id} ${humanId} ${cityName(city)} ${city.country} ${sectorName(record.sector)} ${t[typeKey[record.type]]} ${t[record.signalKey]}`.toLocaleLowerCase(lang);
    return (!$('locationFilter').value||$('locationFilter').value==='all'||record.cityId===$('locationFilter').value)
      &&(!$('sectorFilter').value||$('sectorFilter').value==='all'||record.sector===$('sectorFilter').value)
      &&(!$('typeFilter').value||$('typeFilter').value==='all'||record.type===$('typeFilter').value)
      &&(!$('priorityFilter').value||$('priorityFilter').value==='all'||record.priorityBand===$('priorityFilter').value)
      &&$('verificationFilter').value==='unverified'
      &&(!q||haystack.includes(q));
  }).sort((a,b)=>recordScore(b).score-recordScore(a).score);
}
function renderKpis(){
  $('kpiCount').textContent=filtered.length;
  const summary=workflow.getSummary();
  $('kpiReviewQueue').textContent=(summary.review||0)+(summary.verification||0);
  $('kpiHigh').textContent=demoRecords.filter(record=>record.priorityBand==='high').length;
  const current=filtered.find(record=>record.id===selectedId)||filtered[0];
  if(current){const scored=recordScore(current);$('kpiPriority').textContent=`${scored.score} / 100`;$('kpiScenarioValue').textContent=`${money(scored.low)}–${money(scored.high)}`;}
  else{$('kpiPriority').textContent='—';$('kpiScenarioValue').textContent='—';}
  $('kpiVerified').textContent=t.unverified;
  $('kpiUnverifiedNote').textContent=`${demoRecords.length} · ${t.demo}`;
}
function renderPipeline(){
  const summary=workflow.getSummary();const active=workflow.getStage(selectedId);const root=$('pipelineTrack');root.replaceChildren();
  workflowStages.forEach((stage,index)=>{
    const item=document.createElement('li');item.className='pipeline-step'+(stage===active?' active':'')+(index<workflowStages.indexOf(active)?' complete':'');
    item.setAttribute('aria-current',stage===active?'step':'false');
    const name=document.createElement('span');name.className='pipeline-step-name';name.textContent=t[stageLabels[stage]];
    const count=document.createElement('strong');count.className='pipeline-count';count.textContent=summary[stage]||0;
    item.append(name,count);root.append(item);
  });
}
function renderList(){
  $('resultCount').textContent=filtered.length;const list=$('opportunityList');list.replaceChildren();
  if(!filtered.length){const empty=document.createElement('div');empty.className='empty';empty.textContent=t.noResults;list.append(empty);return;}
  filtered.forEach(record=>{
    const city=cities.find(item=>item.id===record.cityId),score=recordScore(record);
    const button=document.createElement('button');button.type='button';button.className='opp-item'+(record.id===selectedId?' selected':'');
    button.setAttribute('aria-pressed',String(record.id===selectedId));button.dataset.recordId=record.id;
    button.innerHTML=`<span><span class="opp-title">${escapeHtml(sectorName(record.sector))}</span><span class="opp-meta">${escapeHtml(cityName(city))} · ${escapeHtml(t[typeKey[record.type]])} · ${escapeHtml(record.id)}</span></span><span class="opp-right"><span class="opp-score">${score.score}/100</span><br><span class="badge">${escapeHtml(t[priorityKey[record.priorityBand]])}</span></span>`;
    button.addEventListener('click',()=>selectRecord(record.id,true));list.append(button);
  });
}
function kv(label,value){return `<div class="kv-item"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`;}
function renderDossier(){
  const record=demoRecords.find(item=>item.id===selectedId);const root=$('dossierContent');root.replaceChildren();
  if(!record){const empty=document.createElement('div');empty.className='empty';empty.textContent=t.dossierPrompt;root.append(empty);$('dossierWorkflow').replaceChildren();$('workflowTimeline').replaceChildren();return;}
  const contract=contractFor(record),scored=recordScore(record),city=scored.city,assumptions=contract.valueScenario.assumptions;
  const card=document.createElement('div');card.className='dossier-record';
  const identity=`<div class="kv-grid">${kv(t.opportunityId,`<code>${escapeHtml(contract.id)}</code>`)}${kv(t.location,`${escapeHtml(cityName(city))} · ${escapeHtml(t.country)}`)}${kv(t.sector,escapeHtml(sectorName(record.sector)))}${kv(t.opportunityType,escapeHtml(t[typeKey[record.type]]))}${kv(t.detectedSession,escapeHtml(formatDate(contract.identity.detectedAt)))}</div>`;
  const signal=`<div class="callout">${escapeHtml(t[record.signalKey])}</div>${kv(t.signal,escapeHtml(t[typeKey[record.type]]))}${kv(t.signalStrength,escapeHtml(t.notMeasured))}`;
  const value=`<div class="value-range">${money(contract.valueScenario.low)}–${money(contract.valueScenario.high)}</div><div class="formula">${escapeHtml(t.monthly)} · ${escapeHtml(t.formulaDetail)}</div><div class="kv-grid compact">${kv(t.ticketPerJob,`${money(assumptions.tickets[0])}–${money(assumptions.tickets[1])}`)}${kv(t.hypotheticalLeads,`${assumptions.leads[0]}–${assumptions.leads[1]}`)}${kv(t.assumedRecoverable,`${Math.round(assumptions.recoverableShare[0]*100)}–${Math.round(assumptions.recoverableShare[1]*100)}%`)}${kv(t.cityMultiplier,String(assumptions.cityMultiplier))}</div>`;
  const priority=`<div class="score-big">${contract.priority.score} / 100</div><div class="formula">${escapeHtml(t.scoreModel)} · ${escapeHtml(t.scenarioOnly)}</div><div class="score-bars">${Object.entries(scored.dimensions).map(([key,value])=>`<div><div class="score-bar-head"><span>${escapeHtml(t[scoreLabels[key]])}</span><span>${value}/100</span></div><div class="track"><div class="fill" style="width:${value}%"></div></div></div>`).join('')}</div><div class="separated-status">${kv(t.evidence,`<span class="badge red">${escapeHtml(t.notAssessed)}</span>`)}${kv(t.freshness,`<span class="badge">${escapeHtml(t.mapOff)}</span>`)}${kv(t.verification,`<span class="badge red">${escapeHtml(t.unverified)}</span>`)}</div>`;
  const evidence=`${kv(t.evidenceAvailable,escapeHtml(t.noEvidence))}${kv(t.evidenceMissing,`<ul class="compact-list"><li>${escapeHtml(t.sourceDate)}</li><li>${escapeHtml(t.corroborated)}</li><li>${escapeHtml(t.scope)}</li></ul>`)}${kv(t.evidenceQuality,`<span class="badge red">${escapeHtml(t.notAssessed)}</span> · ${escapeHtml(t.syntheticDataset)}`)}`;
  const provenance=`<div class="kv-grid">${kv(t.sourceLabel,escapeHtml(t.syntheticDataset))}${kv(t.collectionDate,escapeHtml(formatDate(contract.provenance.collectionDate)))}${kv(t.coverage,escapeHtml(t.syntheticCoverage))}${kv(t.freshness,escapeHtml(t.freshnessDemo))}${kv(t.reliability,escapeHtml(t.notAssessed))}${kv(t.permissionStatus,escapeHtml(t.localSyntheticPermission))}${kv(t.evidenceType,escapeHtml(t.evidenceTypeSynthetic))}</div>`;
  const risk=`<div class="kv-grid">${kv(t.dataUncertainty,`<span class="badge red">${escapeHtml(t.syntheticHighUncertainty)}</span>`)}${kv(t.falsePositiveRisk,`<span class="badge">${escapeHtml(t.notAssessed)}</span>`)}${kv(t.operationalRisk,`<span class="badge">${escapeHtml(t.notAssessed)}</span>`)}</div>`;
  const interpretation=`<div class="callout muted-callout">${escapeHtml(t.interpretationText)}</div>`;
  const recommendation=`<div>${escapeHtml(t[record.actionKey])}</div>${kv(t.whyRecommendation,escapeHtml(t.interpretationText))}<p class="formula" data-i18n="requiresHumanApproval">${escapeHtml(t.requiresHumanApproval)}</p>`;
  const sections=[
    [t.dossierIdentity,identity],[t.signal,signal],[t.interpretation,interpretation],[t.estimatedValue,value],
    [t.priorityScore,priority],[t.evidence,evidence],[t.sourceProvenance,provenance],[t.verificationState,`<span class="badge red">${escapeHtml(t.unverified)}</span><p class="formula">${escapeHtml(t.verifyHint)}</p>`],
    [t.risk,risk],[t.recommendedAction,recommendation]
  ];
  const top=document.createElement('div');top.className='dossier-top';top.innerHTML=`<div><h2>${escapeHtml(sectorName(record.sector))}</h2><p>${escapeHtml(cityName(city))} · ${escapeHtml(t[typeKey[record.type]])}</p></div><span class="badge">${escapeHtml(t.demo)}</span>`;card.append(top);
  const secRoot=document.createElement('div');secRoot.className='dossier-sections';
  sections.forEach(([label,content])=>{const section=document.createElement('section');section.className='dossier-section';const title=document.createElement('div');title.className='dossier-label';title.textContent=label;const body=document.createElement('div');body.className='dossier-content';body.innerHTML=content;section.append(title,body);secRoot.append(section);});
  card.append(secRoot);root.append(card);renderDossierWorkflow(contract);
}
function eventText(event){
  if(event.kind==='generated')return t.auditGenerated;
  if(event.kind==='opened')return t.auditOpened;
  if(event.kind==='review')return t.auditReviewed;
  if(event.kind==='draft')return t.auditDraft;
  if(event.kind==='reset')return t.auditReset;
  if(event.kind==='stage')return `${t.auditStage} · ${t[stageLabels[event.stage]]||event.stage}`;
  return t.auditOpened;
}
function renderDossierWorkflow(contract){
  const root=$('dossierWorkflow');root.replaceChildren();if(!contract)return;
  const stage=contract.workflowStage,index=workflowStages.indexOf(stage),isLast=index===workflowStages.length-1;
  const stageTrack=workflowStages.map(item=>`<span class="mini-stage${item===stage?' active':''}">${escapeHtml(t[stageLabels[item]])}</span>`).join('');
  root.innerHTML=`<div class="workflow-bar"><div><span class="dossier-label">${escapeHtml(t.pipelineTitle)}</span><strong>${escapeHtml(t[stageLabels[stage]])}</strong></div><span class="badge">${escapeHtml(t.workflowLocal)}</span></div><div class="mini-pipeline">${stageTrack}</div><p class="formula">${escapeHtml(t.pipelineHint)}</p><div class="action-row"><button id="nextStage" class="button tiny secondary" type="button" ${isLast?'disabled':''}>${escapeHtml(isLast?t.stageComplete:t.nextStage)}</button><button id="resetStage" class="button tiny" type="button">${escapeHtml(t.resetStage)}</button></div>`;
  $('nextStage').addEventListener('click',()=>{const next=workflow.advance(contract.id);if(next){addHistory('auditStage',t[stageLabels[next]]);renderAll();}else showToast(t.stageComplete);});
  $('resetStage').addEventListener('click',()=>{workflow.reset(contract.id);addHistory('auditReset');renderAll();});
  const timeline=$('workflowTimeline');timeline.replaceChildren();const events=workflow.getEvents(contract.id).slice().reverse();
  if(!events.length){const item=document.createElement('li');item.className='audit-event';item.textContent=t.auditEmpty;timeline.append(item);return;}
  events.forEach(event=>{const li=document.createElement('li');li.className='audit-event';const time=document.createElement('time');time.dateTime=event.at;time.textContent=formatDate(event.at);const text=document.createElement('span');text.textContent=eventText(event);li.append(time,text);timeline.append(li);});
}
function renderHistory(){
  const root=$('historyList');root.replaceChildren();
  if(!history.length){$('history').querySelector('.section-head p').textContent=t.historyEmpty;return;}
  history.forEach(item=>{const row=document.createElement('div');row.className='history-item';row.textContent=`${formatDate(item.at)} · ${t[item.key]||item.key}${item.detail?` · ${item.detail}`:''}`;root.append(row);});
  $('history').querySelector('.section-head p').textContent=`${history.length} · ${lang.toUpperCase()}`;
}
function renderLeakageCatalog(){
  const root=$('leakageCatalog');root.replaceChildren();
  leakageCategories.forEach(category=>{
    const count=category.type?demoRecords.filter(record=>record.type===category.type).length:0;
    const button=document.createElement('button');button.type='button';button.className='leakage-category'+(category.type?' actionable':' concept');button.disabled=!category.type;
    const title=document.createElement('strong');title.textContent=t[category.key];const status=document.createElement('span');status.textContent=category.type?`${count} · ${t.syntheticExamples}`:t.conceptOnly;button.append(title,status);
    if(category.type)button.addEventListener('click',()=>{$('typeFilter').value=category.type;$('searchFilter').value='';renderAll();$('opportunities').scrollIntoView({behavior:'smooth',block:'start'});});root.append(button);
  });
}
function renderAll(){
  filtered=filteredRecords();if(!filtered.some(record=>record.id===selectedId))selectedId=filtered[0]?.id||null;
  renderList();renderDossier();renderKpis();renderPipeline();renderHistory();syncMapMarkers();
}
function selectRecord(id,focusMap=false){
  const record=demoRecords.find(item=>item.id===id);if(!record)return;
  selectedId=id;$('locationFilter').value=record.cityId;$('sectorFilter').value=record.sector;
  workflow.addEvent(id,'opened');renderAll();
  if(focusMap&&mapController)focusCity(record.cityId,'city');
}
function updateMapStatus(loaded){$('mapStatusText').textContent=loaded?t.mapLoaded:t.mapOff;$('mapStatusDot').classList.toggle('off',!loaded);}
function syncMapMarkers(){if(mapController)mapController.render(filtered,selectedId);}
function selectedCityId(){return demoRecords.find(record=>record.id===selectedId)?.cityId||cities[0].id;}
function focusCity(cityId,view='city'){mapView=view;mapController?.setView(view,cityId);document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));}
function setMapView(view){const cityId=$('locationFilter').value!=='all'&&$('locationFilter').value?$('locationFilter').value:selectedCityId();focusCity(cityId,view);}
function currentMapLayers(){return Object.fromEntries(['markers','leakage','demand','priority','verification','risk'].map(key=>[key,document.querySelector(`[data-layer="${key}"]`).checked]));}
async function loadMap(){
  if(mapController)return;
  $('loadMap').disabled=true;$('loadMapEmpty').disabled=true;$('loadMap').textContent=t.mapLoading;$('loadMapEmpty').textContent=t.mapLoading;
  try{
    mapController=await new OpportunityMap({containerId:'map',records:filtered,layers:currentMapLayers(),labels:t,selectedId,onSelect:id=>selectRecord(id,true),onTileError:()=>{mapTileErrors++;if(mapTileErrors===3)showToast(t.mapError);}}).mount(mapView,selectedCityId());
    $('mapPlaceholder').hidden=true;updateMapStatus(true);syncMapMarkers();
  }catch(error){mapController=null;$('mapPlaceholder').hidden=false;showToast(t.mapError);}
  finally{$('loadMap').disabled=false;$('loadMapEmpty').disabled=false;$('loadMap').textContent=t.loadMap;$('loadMapEmpty').textContent=t.loadMap;}
}
function resetMap(){if(mapController)mapController.resetView(mapView,$('locationFilter').value!=='all'&&$('locationFilter').value?$('locationFilter').value:selectedCityId());else setMapView('city');}
function toggleFullscreen(){const wrap=$('map').parentElement;const active=wrap.classList.toggle('map-fullscreen');document.body.classList.toggle('map-fullscreen-active',active);$('fullscreenMap').textContent=active?t.exitFullscreen:t.fullscreen;mapController?.map?.invalidateSize();}
function refreshScenario(){
  if(!filtered.length){showToast(t.noResults);return;}
  selectedId=filtered[0].id;const record=demoRecords.find(item=>item.id===selectedId);$('locationFilter').value=record.cityId;$('sectorFilter').value=record.sector;
  renderAll();focusCity(record.cityId,'city');addHistory('historyScan',`${cityName(cities.find(item=>item.id===record.cityId))} · ${sectorName(record.sector)}`);
}
function showToast(message){const toast=$('toast');toast.textContent=message;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,2400);}
function updateChecklist(){const count=document.querySelectorAll('.evidence-check:checked').length;$('checkProgress').firstChild.textContent=String(count);if(selectedId)workflow.addEvent(selectedId,'review');renderDossierWorkflow(selectedId?contractFor(demoRecords.find(record=>record.id===selectedId)):null);}
function openDraft(){
  const record=demoRecords.find(item=>item.id===selectedId);if(!record)return;const score=recordScore(record),city=score.city;
  $('draftText').value=`${t.draftSubject}\n\n${t.draftScenarioLabel}: ${sectorName(record.sector)} · ${cityName(city)}\n${t.draftValueLabel}: ${money(score.low)}–${money(score.high)} · ${t.monthly} (${t.draftAssumptionNote}).\n\n${t.draftNextStepLabel}: ${t[record.actionKey]} ${t.draftGuardrail}\n\n${t.draftNoContact}`;
  $('draftPanel').hidden=false;$('reviewState').textContent=t.notReviewed;workflow.addEvent(record.id,'draft');addHistory('historyDraft',cityName(city));renderDossierWorkflow(contractFor(record));
}
function changeLanguage(next){
  lang=translations[next]?next:'en';t=applyLanguage(lang);$('languageSelect').value=lang;
  const citySelect=$('locationFilter'),value=citySelect.value;citySelect.querySelectorAll('option:not(:first-child)').forEach(option=>option.remove());
  cities.forEach(city=>{const option=document.createElement('option');option.value=city.id;option.textContent=cityName(city);citySelect.append(option);});citySelect.value=value;
  document.querySelectorAll('[data-layer]').forEach(input=>{const key={markers:'layerSignals',leakage:'layerLeakage',demand:'layerDemand',priority:'mapPriority',verification:'mapVerification',risk:'mapRisk'}[input.dataset.layer];input.closest('label').lastElementChild.textContent=t[key];});
  $('mapMarkerNotice').textContent=t.markerNotice;
  $('fullscreenMap').textContent=document.querySelector('.map-wrap').classList.contains('map-fullscreen')?t.exitFullscreen:t.fullscreen;
  if(mapController){mapController.updateLabels(t);updateMapStatus(true);}renderLeakageCatalog();renderAll();
}

initFilters();$('languageSelect').value=lang;changeLanguage(lang);
$('searchFilter').addEventListener('input',renderAll);
['locationFilter','sectorFilter','typeFilter','priorityFilter','verificationFilter'].forEach(id=>$(id).addEventListener('change',()=>{renderAll();addHistory('historyFilter');if(id==='locationFilter'&&mapController&&$('locationFilter').value!=='all')focusCity($('locationFilter').value,'city');}));
$('clearFilters').addEventListener('click',()=>{$('searchFilter').value='';$('locationFilter').value='all';$('sectorFilter').value='all';$('typeFilter').value='all';$('priorityFilter').value='all';$('verificationFilter').value='unverified';renderAll();});
$('languageSelect').addEventListener('change',event=>changeLanguage(event.target.value));
$('loadMap').addEventListener('click',loadMap);$('loadMapEmpty').addEventListener('click',loadMap);$('resetMap').addEventListener('click',resetMap);$('fullscreenMap').addEventListener('click',toggleFullscreen);
$('refreshScenario').addEventListener('click',refreshScenario);
document.querySelectorAll('[data-layer]').forEach(input=>input.addEventListener('change',()=>{if(mapController)mapController.updateLayers(currentMapLayers());}));
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setMapView(button.dataset.view)));
document.querySelectorAll('.evidence-check').forEach(input=>input.addEventListener('change',updateChecklist));
$('prepareDraft').addEventListener('click',openDraft);$('closeDraft').addEventListener('click',()=>{$('draftPanel').hidden=true;});
$('copyDraft').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('draftText').value);showToast(t.copied);}catch{$('draftText').select();showToast(t.copyManual);}});
$('markReviewed').addEventListener('click',()=>{$('reviewState').textContent=t.reviewedLocal;if(selectedId)workflow.addEvent(selectedId,'review');addHistory('reviewedLocal');renderDossierWorkflow(selectedId?contractFor(demoRecords.find(record=>record.id===selectedId)):null);});
$('demoInfo').addEventListener('click',()=>{const dialog=$('demoDialog');if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');});$('closeDemoInfo').addEventListener('click',()=>$('demoDialog').close());
$('demoDialog').addEventListener('click',event=>{if(event.target===$('demoDialog'))$('demoDialog').close();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.querySelector('.map-wrap').classList.contains('map-fullscreen'))toggleFullscreen();});
renderLeakageCatalog();renderAll();
