import { cities, regions, sectors, opportunityTypes, demoRecords } from './demo-data.js';
import { scenarioFor, money } from './scoring.js';
import { getLanguage, applyLanguage } from './i18n.js';
import { OpportunityMap } from './map-view.js';
import { toOpportunityContract } from './opportunity-contract.js';
import { DemoWorkflow, workflowStages } from './demo-workflow.js';
import { WorldGlobe } from './globe-view.js';

let lang=getLanguage();
let t=applyLanguage(lang);
let selectedId=demoRecords[0]?.id||null;
let filtered=[];
let history=[];
let mapController=null;
let globeController=null;
let visualMode='globe';
let globeStatusCode='ready';
let mapView='world';
let mobileDossierOpen=false;
const sessionStartedAt=new Date().toISOString();
const workflow=new DemoWorkflow(demoRecords.map(record=>record.id),sessionStartedAt);
const reviewChecks=new Map();
const $=id=>document.getElementById(id);
const stageLabels={detected:'stageDetected',review:'stageReview',verification:'stageVerification',qualified:'stageQualified',actionReady:'stageActionReady',resolved:'stageResolved'};
const priorityKey={high:'priorityHigh',medium:'priorityMedium',low:'priorityLow'};
const scoreLabels={demand:'demandDemo',urgency:'urgencyDemo',scope:'scopeDemo'};
const all=select=>!select||select.value==='all';
const clean=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase(lang);
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const cityById=id=>cities.find(city=>city.id===id);
const cityName=city=>city?.names?.[lang]||city?.names?.en||'';
const countryName=city=>city?.countries?.[lang]||city?.countries?.en||'';
const regionName=id=>regions[id]?.names?.[lang]||regions[id]?.names?.en||'';
const sectorName=id=>sectors[id]?.names?.[lang]||sectors[id]?.names?.en||id;
const typeInfo=id=>opportunityTypes[id]||opportunityTypes.missedDemand;
const typeName=id=>typeInfo(id).names[lang]||typeInfo(id).names.en;
const mapLabels=()=>({...t,lang,typeName});
const recordScore=record=>scenarioFor(record);
const contractFor=record=>toOpportunityContract(record,recordScore(record),workflow.getStage(record.id));
const formatDate=value=>{const date=new Date(value);return Number.isNaN(date.getTime())?t.notAssessed:new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeStyle:'short'}).format(date);};

function addHistory(key,detail=''){
  history.unshift({key,detail,at:new Date().toISOString()});
  if(history.length>60)history.length=60;
  renderHistory();
}
function fillSelect(id,rows,allLabel){
  const select=$(id);if(!select)return;
  const previous=select.value||'all';
  while(select.options.length>1)select.remove(1);
  rows.forEach(row=>{const option=document.createElement('option');option.value=row.value;option.textContent=row.label;select.append(option);});
  select.value=[...select.options].some(option=>option.value===previous)?previous:'all';
  if(select.options[0])select.options[0].textContent=allLabel;
}
function initFilters(){
  fillSelect('regionFilter',Object.keys(regions).map(id=>({value:id,label:regionName(id)})),t.allRegions);
  const countryRows=[...new Map(cities.map(city=>[city.countryCode,{value:city.countryCode,label:countryName(city)}])).values()].sort((a,b)=>a.label.localeCompare(b.label,lang));
  fillSelect('countryFilter',countryRows,t.allCountries);
  fillSelect('locationFilter',cities.map(city=>({value:city.id,label:cityName(city)})).sort((a,b)=>a.label.localeCompare(b.label,lang)),t.allCities);
  fillSelect('sectorFilter',Object.keys(sectors).map(id=>({value:id,label:sectorName(id)})),t.allSectors);
  fillSelect('typeFilter',Object.keys(opportunityTypes).map(id=>({value:id,label:typeName(id)})),t.allTypes);
}
function searchCorpus(record){
  const city=cityById(record.cityId),type=typeInfo(record.type),sector=sectors[record.sector];
  const translations=[...Object.values(city.names),...Object.values(city.countries),...Object.values(type.names),...Object.values(type.problem),...Object.values(sector.names)];
  const region=regions[record.regionId];if(region)translations.push(...Object.values(region.names));
  return clean([record.id,record.cityId,record.countryCode,record.sector,record.type,...translations].join(' '));
}
function filteredRecords(){
  const query=clean($('searchFilter')?.value.trim()||'');
  return demoRecords.filter(record=>{
    const matchesRegion=all($('regionFilter'))||record.regionId===$('regionFilter').value;
    const matchesCountry=all($('countryFilter'))||record.countryCode===$('countryFilter').value;
    const matchesCity=all($('locationFilter'))||record.cityId===$('locationFilter').value;
    const matchesSector=all($('sectorFilter'))||record.sector===$('sectorFilter').value;
    const matchesType=all($('typeFilter'))||record.type===$('typeFilter').value;
    const matchesPriority=all($('priorityFilter'))||recordScore(record).priorityBand===$('priorityFilter').value;
    return matchesRegion&&matchesCountry&&matchesCity&&matchesSector&&matchesType&&matchesPriority&&(!query||searchCorpus(record).includes(query));
  }).sort((a,b)=>recordScore(b).score-recordScore(a).score||a.id.localeCompare(b.id));
}
function renderSummary(){
  $('kpiCount').textContent=String(filtered.length);
  $('kpiRegions').textContent=String(new Set(filtered.map(record=>record.regionId)).size);
  $('kpiHigh').textContent=String(filtered.filter(record=>recordScore(record).priorityBand==='high').length);
  $('kpiVerified').textContent='0';
  $('resultCount').textContent=String(filtered.length);
  $('mapCount').textContent=`${filtered.length} · ${t.demo}`;
}
function renderList(){
  const root=$('opportunityList');root.replaceChildren();
  if(!filtered.length){const empty=document.createElement('div');empty.className='empty';empty.textContent=t.noResults;root.append(empty);return;}
  filtered.forEach(record=>{
    const city=cityById(record.cityId),score=recordScore(record);
    const button=document.createElement('button');button.type='button';button.className='opp-item'+(record.id===selectedId?' selected':'');button.setAttribute('role','listitem');button.setAttribute('aria-pressed',String(record.id===selectedId));button.dataset.recordId=record.id;
    button.setAttribute('aria-label',`${cityName(city)}, ${countryName(city)} · ${typeName(record.type)} · ${t[priorityKey[score.priorityBand]]} · ${record.id}`);
    button.innerHTML=`<span><span class="opp-title">${esc(typeName(record.type))}</span><span class="opp-meta">${esc(cityName(city))}, ${esc(countryName(city))} · ${esc(regionName(record.regionId))} · ${esc(sectorName(record.sector))}</span><span class="opp-meta">${esc(record.id)} · ${esc(t.demo)} · ${esc(t.unverified)}</span></span><span class="opp-right"><span class="opp-score">${score.score}/100</span><br><span class="badge">${esc(t[priorityKey[score.priorityBand]])}</span></span>`;
    button.addEventListener('click',()=>selectRecord(record.id,'list'));
    root.append(button);
  });
}
function section(title,body){return `<section class="dossier-section"><div class="dossier-label">${esc(title)}</div><div class="dossier-content">${body}</div></section>`;}
function metric(label,value){return `<div class="dossier-meta"><span>${esc(label)}</span><strong>${value}</strong></div>`;}
function renderDossier(){
  const root=$('dossierContent');root.replaceChildren();
  const record=demoRecords.find(item=>item.id===selectedId);
  if(!record){const empty=document.createElement('div');empty.className='empty';empty.textContent=t.dossierPrompt;root.append(empty);$('dossierWorkflow').replaceChildren();$('workflowTimeline').replaceChildren();$('selectedPreviewText').textContent=t.dossierPrompt;return;}
  const contract=contractFor(record),scored=recordScore(record),city=scored.city,signal=typeInfo(record.type),checks=reviewChecks.get(record.id)||new Set();
  const priorityText=t[priorityKey[scored.priorityBand]];
  const claimKeys={FACT:'claimFact',VERIFIED:'claimVerified',LIKELY:'claimLikely',HYPOTHESIS:'claimHypothesis',UNVERIFIED:'claimUnverified',CONFLICTING:'claimConflicting'};
  const claims=(contract.evidence.claims||[]).map(claim=>`<span class="claim-chip" data-state="${esc(claim.state)}">${esc(t[claimKeys[claim.state]]||claim.state)}</span>`).join('');
  const stateLegend=`<details class="epistemic-legend"><summary>${esc(t.claimLegendTitle)}</summary><p>${esc(t.claimLegendHint)}</p><div class="epistemic-chips">${Object.entries(claimKeys).map(([state,key])=>`<span class="epistemic-chip" data-state="${state}">${esc(t[key])}</span>`).join('')}</div></details>`;
  const top=`<div class="dossier-top"><span class="badge">${esc(t.syntheticIntelligence)}</span><span class="signal-type-chip" data-signal="${esc(record.type)}">${esc(typeName(record.type))}</span></div>`;
  const why=`<p>${esc(signal.why[lang])}</p><p>${esc(signal.whyNow[lang])}</p><p class="formula">${esc(t.generalTrendOnly)}</p>`;
  const assumptions=contract.valueScenario.assumptions;
  const value=`<div class="value-range">${esc(money(contract.valueScenario.low,lang))} – ${esc(money(contract.valueScenario.high,lang))}</div><p class="formula">${esc(t.monthly)} · ${esc(t.scenarioAssumptions)}</p><details class="scenario-assumptions"><summary>${esc(t.scenarioFormula)}</summary><div class="kv-grid compact">${metric(t.hypotheticalLeads,`${assumptions.prospects[0]}–${assumptions.prospects[1]}`)}${metric(t.ticketPerJob,`${money(assumptions.ticket[0],lang)}–${money(assumptions.ticket[1],lang)}`)}${metric(t.assumedRecoverable,`${Math.round(assumptions.recoverableShare[0]*100)}–${Math.round(assumptions.recoverableShare[1]*100)}%`)}<p class="formula">${esc(t.scenarioFormulaText)}</p></div></details>`;
  const dimensionBars=Object.entries(scored.dimensions).map(([key,value])=>`<div><div class="score-bar-head"><span>${esc(t[scoreLabels[key]])}</span><span>${value}/100</span></div><div class="track"><div class="fill" style="width:${value}%"></div></div></div>`).join('');
  const priority=`<div class="dossier-priority"><strong>${scored.score}/100</strong><span class="badge">${esc(priorityText)}</span></div><p class="priority-explanation">${esc(t.priorityExplanation)}</p><div class="score-bars">${dimensionBars}</div>`;
  const evidence=`<p>${esc(signal.evidence[lang])}</p><div class="dossier-callout"><strong>${esc(t.evidenceQuestion)}</strong><p>${esc(t.evidenceQuestionText)}</p></div>${stateLegend}`;
  const provenance=`<div class="dossier-metadata">${metric(t.sourceLabel,esc(t.syntheticSource))}${metric(t.coverage,esc(t.coverageGlobal))}${metric(t.freshness,esc(t.noObservedTime))}${metric(t.reliability,esc(t.notAssessed))}</div>`;
  const action=`<p>${esc(signal.action[lang])}</p><p class="formula">${esc(t.reviewAgainstAuthorizedEvidence)}</p><p class="no-send-note">${esc(t.requiresHumanApproval)}</p>`;
  const location=`<div class="signal-location"><strong>${esc(typeName(record.type))}</strong><span>${esc(cityName(city))}, ${esc(countryName(city))} · ${esc(regionName(city.regionId))}</span><small>${esc(record.id)} · ${esc(sectorName(record.sector))}</small></div>`;
  const problemCard=section(t.problem,`<p>${esc(signal.problem[lang])}</p><p class="formula">${esc(t.signalNotProof)} · ${esc(t.unverified)}</p>`);
  const aiCopy={en:'An AI-assisted queue can flag stalled follow-ups, group duplicate requests, and suggest a next step; n8n can route the draft for human review. Nothing is sent automatically.',fr:'Une file assistée par IA peut repérer les suivis en retard, regrouper les demandes en double et suggérer une étape ; n8n peut transmettre le brouillon à un humain. Aucun envoi automatique.',ar:'يمكن لقائمة انتظار مدعومة بالذكاء الاصطناعي رصد المتابعات المتأخرة وتجميع الطلبات المكررة واقتراح الخطوة التالية؛ ويمكن لـ n8n توجيه المسودة للمراجعة البشرية. لا يُرسل شيء تلقائيًا.',ru:'Очередь с поддержкой ИИ может выявлять задержанные последующие действия, объединять дубликаты и предлагать следующий шаг; n8n направит черновик человеку. Автоматическая отправка отключена.',zh:'AI 辅助队列可标记延迟跟进、合并重复请求并建议下一步；n8n 可将草稿转交人工审核。不会自动发送任何内容。',ko:'AI 지원 대기열은 지연된 후속 조치를 표시하고 중복 요청을 묶어 다음 단계를 제안할 수 있으며, n8n은 초안을 사람에게 검토하도록 전달합니다. 자동 발송은 하지 않습니다.'};
  const aiCard=section(t.aiLeverage,`<p>${esc(aiCopy[lang]||aiCopy.en)}</p><p class="formula">${esc(t.aiNotConnected)}</p>`);
  const blueprintCard=section(t.businessBlueprint,`<ol class="blueprint-list"><li>${esc(t.blueprintDetect)}</li><li>${esc(t.blueprintVerify)}</li><li>${esc(t.blueprintSolve)}</li></ol>`);
  const more=`<details class="dossier-more"><summary>${esc(t.evidence)} · ${esc(t.estimatedValue)} · ${esc(t.priorityScore)}</summary><div>${section(t.whyNow,why)}${section(t.estimatedValue,value)}${section(t.priorityScore,priority)}${section(t.evidence,evidence)}${section(t.sourceProvenance,provenance)}${section(t.recommendedAction,action)}</div></details>`;
  root.innerHTML=`<div class="dossier-record">${top}${section(t.signal,location)}${problemCard}${aiCard}${blueprintCard}${more}</div>`;
  $('selectedPreviewText').textContent=`${cityName(city)} · ${typeName(record.type)} · ${scored.score}/100 · ${t.unverified}`;
  document.querySelectorAll('.evidence-check').forEach((input,index)=>{input.checked=checks.has(index);});
  updateCheckProgress();
  renderDossierWorkflow(contract);
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
  const stageTrack=workflowStages.map(item=>`<span class="mini-stage${item===stage?' active':''}">${esc(t[stageLabels[item]])}</span>`).join('');
  root.innerHTML=`<div class="workflow-bar"><div><span class="dossier-label">${esc(t.pipelineTitle)}</span><strong>${esc(t[stageLabels[stage]])}</strong></div><span class="badge">${esc(t.workflowLocal)}</span></div><div class="mini-pipeline">${stageTrack}</div><p class="formula">${esc(t.pipelineHint)}</p><div class="action-row"><button id="nextStage" class="button tiny secondary" type="button" ${isLast?'disabled':''}>${esc(isLast?t.stageComplete:t.nextStage)}</button><button id="resetStage" class="button tiny" type="button">${esc(t.resetStage)}</button></div>`;
  $('nextStage').addEventListener('click',()=>{const next=workflow.advance(contract.id);if(next){addHistory('auditStage',t[stageLabels[next]]);renderAll();}else showToast(t.stageComplete);});
  $('resetStage').addEventListener('click',()=>{workflow.reset(contract.id);addHistory('auditReset');renderAll();});
  const timeline=$('workflowTimeline');timeline.replaceChildren();
  const events=workflow.getEvents(contract.id).slice().reverse();
  if(!events.length){const item=document.createElement('li');item.className='audit-event';item.textContent=t.auditEmpty;timeline.append(item);return;}
  events.forEach(event=>{const li=document.createElement('li');li.className='audit-event';const time=document.createElement('time');time.dateTime=event.at;time.textContent=formatDate(event.at);const text=document.createElement('span');text.textContent=eventText(event);li.append(time,text);timeline.append(li);});
}
function renderPipeline(){
  const summary=workflow.getSummary(),active=selectedId?workflow.getStage(selectedId):'detected',root=$('pipelineTrack');root.replaceChildren();
  workflowStages.forEach((stage,index)=>{const item=document.createElement('li');item.className='pipeline-step'+(stage===active?' active':'')+(index<workflowStages.indexOf(active)?' complete':'');item.setAttribute('aria-current',stage===active?'step':'false');const name=document.createElement('span');name.className='pipeline-step-name';name.textContent=t[stageLabels[stage]];const count=document.createElement('strong');count.className='pipeline-count';count.textContent=summary[stage]||0;item.append(name,count);root.append(item);});
}
function renderHistory(){
  const root=$('historyList');if(!root)return;root.replaceChildren();
  if(!history.length){$('history').querySelector('.section-head p').textContent=t.historyEmpty;return;}
  history.forEach(item=>{const row=document.createElement('div');row.className='history-item';row.textContent=`${formatDate(item.at)} · ${t[item.key]||item.key}${item.detail?` · ${item.detail}`:''}`;root.append(row);});
  $('history').querySelector('.section-head p').textContent=`${history.length} · ${t.workflowLocal}`;
}
function renderLeakageCatalog(){
  const root=$('leakageCatalog');root.replaceChildren();
  Object.entries(opportunityTypes).forEach(([type,definition])=>{
    const count=demoRecords.filter(record=>record.type===type).length,button=document.createElement('button');button.type='button';button.className='leakage-category actionable';
    const title=document.createElement('strong');title.textContent=typeName(type);const status=document.createElement('span');status.textContent=`${count} · ${t.demo}`;button.append(title,status);
    button.addEventListener('click',()=>{$('typeFilter').value=type;renderAll();$('opportunities').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});root.append(button);
  });
}
function renderAll(){
  filtered=filteredRecords();
  if(!filtered.some(record=>record.id===selectedId))selectedId=filtered[0]?.id||null;
  renderSummary();renderList();renderDossier();renderPipeline();renderHistory();
  const activeRecord=demoRecords.find(record=>record.id===selectedId);
  $('mapShell').dataset.activeSignal=activeRecord?.type||'missedDemand';
  document.querySelector('.radar-grid').dataset.activeSignal=activeRecord?.type||'missedDemand';
  mapController?.render(filtered,selectedId);
  globeController?.render(filtered,selectedId);
}
function selectRecord(id,origin='list'){
  const record=demoRecords.find(item=>item.id===id);if(!record)return;
  selectedId=id;workflow.addEvent(id,'opened');addHistory('auditOpened',record.id);renderAll();
  if(origin!=='map')mapController?.focusRecord(record);
  globeController?.focusRecord(record);
  if(window.matchMedia('(max-width: 820px)').matches)toggleDossier(true);
}
function viewContext(){
  const record=demoRecords.find(item=>item.id===selectedId)||filtered[0]||demoRecords[0];
  return {cityId:record?.cityId,regionId:$('regionFilter').value!=='all'?$('regionFilter').value:record?.regionId,countryCode:$('countryFilter').value!=='all'?$('countryFilter').value:record?.countryCode};
}
function setMapView(view){
  mapView=view;document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  mapController?.setView(view,viewContext());
  globeController?.setView(view,viewContext());
}
function handleCountrySelect(code,name=''){
  const matching=cities.find(city=>city.countryCode===code);
  if(matching){$('regionFilter').value=matching.regionId;}
  $('countryFilter').value=code;
  if(!$('countryFilter').querySelector(`option[value="${CSS.escape(code)}"]`)){
    const option=document.createElement('option');option.value=code;option.textContent=name||code;$('countryFilter').append(option);
  }
  $('locationFilter').value='all';mapView='country';renderAll();setMapView('country');showToast(t.countryClick);
}
function toggleDrawer(open){
  const drawer=$('filterDrawer'),button=$('filtersToggle');drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));drawer.inert=!open;button.setAttribute('aria-expanded',String(open));$('filterBackdrop').hidden=!open;
  if(open)setTimeout(()=>$('searchFilter').focus(),40);else button.focus({preventScroll:true});
}
function syncFilterDrawerLayout(){
  const drawer=$('filterDrawer'),button=$('filtersToggle'),backdrop=$('filterBackdrop'),mobile=window.matchMedia('(max-width: 1600px)').matches;
  if(!mobile){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','false');drawer.inert=false;button.setAttribute('aria-expanded','false');backdrop.hidden=true;return;}
  const open=drawer.classList.contains('open');drawer.setAttribute('aria-hidden',String(!open));drawer.inert=!open;button.setAttribute('aria-expanded',String(open));backdrop.hidden=!open;
}
function toggleDossier(open){
  const panel=$('dossier'),button=$('openDossier'),mobile=window.matchMedia('(max-width: 820px)').matches;
  mobileDossierOpen=mobile&&open;panel.classList.toggle('mobile-open',mobileDossierOpen);panel.setAttribute('aria-hidden',String(mobile&&!mobileDossierOpen));panel.inert=mobile&&!mobileDossierOpen;
  button.setAttribute('aria-expanded',String(mobileDossierOpen));button.querySelector('.preview-label').textContent=mobileDossierOpen?t.closeDossier:t.openDossier;
  if(mobileDossierOpen)panel.querySelector('.dossier-close')?.focus({preventScroll:true});else if(mobile)button.focus({preventScroll:true});
}
function syncDossierLayout(){
  syncFilterDrawerLayout();
  const mobile=window.matchMedia('(max-width: 820px)').matches,panel=$('dossier'),close=$('closeDossier');
  if(mobile){if(close.parentElement!==panel.querySelector('.dossier-heading'))panel.querySelector('.dossier-heading').append(close);panel.setAttribute('aria-hidden',String(!mobileDossierOpen));panel.inert=!mobileDossierOpen;panel.classList.toggle('mobile-open',mobileDossierOpen);}
  else{if(close.parentElement!==document.querySelector('.map-foot'))document.querySelector('.map-foot').append(close);panel.classList.remove('mobile-open');panel.setAttribute('aria-hidden','false');panel.inert=false;mobileDossierOpen=false;}
  $('openDossier').hidden=!mobile;
  if(mobile)$('openDossier').querySelector('.preview-label').textContent=mobileDossierOpen?t.closeDossier:t.openDossier;
  requestAnimationFrame(()=>{mapController?.invalidateSize();if(mapView==='world')mapController?.setView('world');globeController?.resize();});
}
function updateCheckProgress(){
  const count=document.querySelectorAll('.evidence-check:checked').length;
  $('checkProgress').innerHTML=`${count} / 4 · <span>${esc(t.checklistProgress)}</span>`;
}
function showToast(message){
  const toast=$('toast');toast.textContent=message;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,2300);
}
function resetFilters(){
  ['regionFilter','countryFilter','locationFilter','sectorFilter','typeFilter','priorityFilter'].forEach(id=>$(id).value='all');$('searchFilter').value='';mapView='world';renderAll();setMapView('world');addHistory('historyFilter');
}
function bindFilterEvents(){
  ['searchFilter','regionFilter','countryFilter','locationFilter','sectorFilter','typeFilter','priorityFilter'].forEach(id=>$(id).addEventListener(id==='searchFilter'?'input':'change',()=>{
    if(id==='regionFilter'){
      if($('regionFilter').value==='all'){$('countryFilter').value='all';$('locationFilter').value='all';mapView='world';}
      else{$('countryFilter').value='all';$('locationFilter').value='all';mapView='region';}
    }
    if(id==='countryFilter'){
      if($('countryFilter').value==='all'){$('locationFilter').value='all';mapView=$('regionFilter').value==='all'?'world':'region';}
      else{$('locationFilter').value='all';const city=cities.find(item=>item.countryCode===$('countryFilter').value);if(city)$('regionFilter').value=city.regionId;mapView='country';}
    }
    if(id==='locationFilter'){
      if($('locationFilter').value==='all')mapView=$('countryFilter').value!=='all'?'country':$('regionFilter').value!=='all'?'region':'world';
      else{const city=cityById($('locationFilter').value);$('regionFilter').value=city.regionId;$('countryFilter').value=city.countryCode;mapView='city';}
    }
    renderAll();if(['regionFilter','countryFilter','locationFilter'].includes(id))setMapView(mapView);
    if(id!=='searchFilter')addHistory('historyFilter');
  }));
  $('clearFilters').addEventListener('click',resetFilters);
  $('filtersToggle').addEventListener('click',()=>toggleDrawer(true));$('closeFilters').addEventListener('click',()=>toggleDrawer(false));$('filterBackdrop').addEventListener('click',()=>toggleDrawer(false));
}
function prepareDraft(){
  const record=demoRecords.find(item=>item.id===selectedId);if(!record)return;
  const scored=recordScore(record),city=scored.city,signal=typeInfo(record.type);
  const text=[t.draftSubject,`${t.opportunityId}: ${record.id}`,`${t.location}: ${cityName(city)}, ${countryName(city)}`,`${t.opportunityType}: ${typeName(record.type)}`,`${t.draftValueLabel}: ${money(scored.low,lang)}–${money(scored.high,lang)} ${t.draftAssumptionNote}`,`${t.draftNextStepLabel}: ${signal.action[lang]}`,t.draftGuardrail,t.draftNoContact].join('\n');
  $('draftText').value=text;$('draftPanel').hidden=false;workflow.addEvent(record.id,'draft');addHistory('historyDraft');$('draftText').focus();
}
async function copyDraft(){
  const area=$('draftText');area.select();
  try{await navigator.clipboard.writeText(area.value);showToast(t.copied);}catch{showToast(t.copyManual);}
}
async function runDemoScan(){
  const button=$('refreshScenario'),status=$('scanStatus'),text=$('scanStatusText'),progress=$('scanProgress');
  if(button.disabled)return;
  const phases=['scanPhaseInitialize','scanPhaseSearch','scanPhaseGroup','scanPhaseReady'];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  button.disabled=true;status.hidden=false;progress.value=0;
  for(let index=0;index<phases.length;index++){
    text.textContent=t[phases[index]];progress.value=Math.round((index+1)*100/phases.length);
    if(!reduced)await new Promise(resolve=>setTimeout(resolve,170));
  }
  // Deterministic loop through local fixtures; not a random or live discovery.
  const currentIndex=Math.max(0,demoRecords.findIndex(record=>record.id===selectedId));
  const next=demoRecords[(currentIndex+1)%demoRecords.length];
  resetFilters();selectedId=next.id;addHistory('historyScan',next.id);renderAll();
  setTimeout(()=>{status.hidden=true;progress.value=0;button.disabled=false;},reduced?120:600);
}
function toggleTiles(){
  const button=$('tilesToggle'),enabled=button.getAttribute('aria-pressed')!=='true';
  if(!mapController?.setTilesEnabled(enabled))return;
  button.setAttribute('aria-pressed',String(enabled));button.textContent=enabled?t.tilesOn:t.tilesOff;
  $('tileNotice').classList.toggle('visible',enabled);$('tilePrivacyHint').textContent=enabled?t.tilePrivacy:t.tileDefaultNote;$('mapMessage').textContent=enabled?t.tilePrivacy:t.mapPrivacyLocal;
}
function toggleFullscreen(force){
  const shell=$('map').closest('.map-shell'),enabled=typeof force==='boolean'?force:!shell.classList.contains('fullscreen');
  mapController?.setFullscreen(enabled);$('fullscreenMap').textContent=enabled?t.exitFullscreen:t.fullscreen;$('fullscreenMap').setAttribute('aria-pressed',String(enabled));
  requestAnimationFrame(()=>globeController?.resize());
  if(enabled)document.body.classList.add('map-is-fullscreen');else document.body.classList.remove('map-is-fullscreen');
}
function setGlobeStatus(code=globeStatusCode){
  globeStatusCode=code;const key={ready:'globeStatusReady',noWebgl:'globeStatusNoWebgl',slow:'globeStatusSlow',degraded:'globeStatusReduced'}[code]||'globeStatusReady';
  if($('globeStatus'))$('globeStatus').textContent=t[key];
}
function updateGlobeRotationButton(enabled=globeController?.autoRotate){
  const button=$('globePause');if(!button)return;const rotating=Boolean(enabled);button.textContent=rotating?t.globePause:t.globeResume;button.setAttribute('aria-pressed',String(!rotating));
}
function setVisualMode(mode,statusCode=null){
  if(mode==='globe'&&!globeController){mode='map';statusCode=statusCode||'noWebgl';}
  visualMode=mode;const shell=$('mapShell');shell.dataset.visual=mode;
  $('map').setAttribute('aria-hidden',String(mode!=='map'));$('globeStage').setAttribute('aria-hidden',String(mode!=='globe'));
  document.querySelectorAll('[data-visual-mode]').forEach(button=>{const active=button.dataset.visualMode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  $('tilesToggle').disabled=mode!=='map';
  if(mode==='globe'){
    globeController?.render(filtered,selectedId);globeController?.setView(mapView,viewContext());globeController?.setActive(true);requestAnimationFrame(()=>globeController?.resize());
  }else{
    globeController?.setActive(false);requestAnimationFrame(()=>{mapController?.invalidateSize();mapController?.setView(mapView,viewContext());});
  }
  setGlobeStatus(statusCode||globeStatusCode);
}
function bindActions(){
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setMapView(button.dataset.view)));
  document.querySelectorAll('[data-visual-mode]').forEach(button=>button.addEventListener('click',()=>setVisualMode(button.dataset.visualMode)));
  $('globePause').addEventListener('click',()=>updateGlobeRotationButton(globeController?.setRotation(!globeController.autoRotate)));
  $('globeZoomIn').addEventListener('click',()=>globeController?.zoomBy(-.25));$('globeZoomOut').addEventListener('click',()=>globeController?.zoomBy(.25));
  $('resetMap').addEventListener('click',()=>{setMapView('world');showToast(t.resetMap);});
  $('fullscreenMap').addEventListener('click',()=>toggleFullscreen());
  $('tilesToggle').addEventListener('click',toggleTiles);
  $('refreshScenario').addEventListener('click',runDemoScan);
  $('exploreExample').addEventListener('click',()=>{
    const current=Math.max(0,demoRecords.findIndex(record=>record.id===selectedId));const next=demoRecords[(current+1)%demoRecords.length];resetFilters();selectRecord(next.id,'list');
  });
  $('openDossier').addEventListener('click',()=>toggleDossier(!mobileDossierOpen));$('closeDossier').addEventListener('click',()=>toggleDossier(false));
  $('prepareDraft').addEventListener('click',prepareDraft);$('copyDraft').addEventListener('click',copyDraft);$('closeDraft').addEventListener('click',()=>{$('draftPanel').hidden=true;});
  $('markReviewed').addEventListener('click',()=>{if(!selectedId)return;workflow.addEvent(selectedId,'review');addHistory('reviewedLocal');$('reviewState').textContent=t.reviewedLocal;showToast(t.reviewedLocal);});
  document.querySelectorAll('.evidence-check').forEach((input,index)=>input.addEventListener('change',()=>{
    if(!selectedId)return;let checks=reviewChecks.get(selectedId);if(!checks){checks=new Set();reviewChecks.set(selectedId,checks);}input.checked?checks.add(index):checks.delete(index);workflow.addEvent(selectedId,'review');updateCheckProgress();
  }));
  $('demoInfo').addEventListener('click',()=>$('demoInfoDialog').showModal());$('closeInfo').addEventListener('click',()=>$('demoInfoDialog').close());
  $('demoInfoDialog').addEventListener('click',event=>{if(event.target===$('demoInfoDialog'))$('demoInfoDialog').close();});
  $('navToggle').addEventListener('click',()=>{const open=$('navToggle').getAttribute('aria-expanded')!=='true';$('navToggle').setAttribute('aria-expanded',String(open));$('mainNav').classList.toggle('open',open);});
  document.querySelectorAll('#mainNav a').forEach(link=>link.addEventListener('click',()=>{$('mainNav').classList.remove('open');$('navToggle').setAttribute('aria-expanded','false');}));
  $('languageSelect').value=lang;$('languageSelect').addEventListener('change',()=>{
    lang=$('languageSelect').value;t=applyLanguage(lang);initFilters();renderAll();mapController?.updateLabels(mapLabels());globeController?.updateLabels(mapLabels());setGlobeStatus(globeStatusCode);updateGlobeRotationButton();$('tilesToggle').textContent=$('tilesToggle').getAttribute('aria-pressed')==='true'?t.tilesOn:t.tilesOff;$('tilePrivacyHint').textContent=$('tilesToggle').getAttribute('aria-pressed')==='true'?t.tilePrivacy:t.tileDefaultNote;$('mapMessage').textContent=$('tilesToggle').getAttribute('aria-pressed')==='true'?t.tilePrivacy:t.mapPrivacyLocal;$('fullscreenMap').textContent=$('map').closest('.map-shell').classList.contains('fullscreen')?t.exitFullscreen:t.fullscreen;$('openDossier').querySelector('.preview-label').textContent=mobileDossierOpen?t.closeDossier:t.openDossier;
  });
  window.addEventListener('resize',syncDossierLayout,{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      if($('map').closest('.map-shell').classList.contains('fullscreen'))toggleFullscreen(false);
      else if(mobileDossierOpen)toggleDossier(false);
      else if($('filterDrawer').classList.contains('open'))toggleDrawer(false);
    }
  });
}
async function initialize(){
  initFilters();bindFilterEvents();bindActions();renderLeakageCatalog();
  syncDossierLayout();
  try{
    mapController=await new OpportunityMap({containerId:'map',records:demoRecords,selectedId,onSelect:selectRecord,onCountrySelect:handleCountrySelect,onTileError:()=>showToast(t.mapError),labels:mapLabels()}).mount();
  }catch(error){$('mapMessage').textContent=t.mapError;$('mapStatusText').textContent=t.mapError;$('mapStatusText').classList.add('error');console.error('Eagle Eye local map:',error);}
  renderAll();
  try{
    globeController=await new WorldGlobe({containerId:'globeCanvasHost',records:filtered,selectedId,onSelect:selectRecord,onFallback:reason=>setVisualMode('map',reason==='performance'?'slow':'noWebgl'),onStatus:setGlobeStatus,onRotationChange:updateGlobeRotationButton,labels:mapLabels()}).mount();
    $('globeModeButton').disabled=false;$('globePause').disabled=false;$('globeZoomIn').disabled=false;$('globeZoomOut').disabled=false;updateGlobeRotationButton(globeController.autoRotate);setVisualMode('globe');renderAll();
  }catch(error){$('globeModeButton').disabled=true;$('globePause').disabled=true;$('globeZoomIn').disabled=true;$('globeZoomOut').disabled=true;setVisualMode('map','noWebgl');console.info('Eagle Eye 3D view unavailable; the local 2D map remains active.',error);}
}
initialize();
