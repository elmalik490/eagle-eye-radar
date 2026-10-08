import { cities, sectors, demoRecords, types } from './demo-data.js';
import { scenarioFor, money } from './scoring.js';
import { translations, getLanguage, applyLanguage } from './i18n.js';
import { OpportunityMap } from './map-view.js';

let lang = getLanguage();
let t = applyLanguage(lang);
let selectedId = 'phoenix-hvac';
let filtered = [];
let history = [];
let mapController = null;
let mapTileErrors = 0;
let mapView = 'city';
const $ = id => document.getElementById(id);
const typeKey = { missedCalls: 'typeMissedCalls', unansweredLeads: 'typeUnansweredLeads', serviceDemand: 'typeServiceDemand' };
const priorityKey = { high: 'priorityHigh', medium: 'priorityMedium', low: 'priorityLow' };
const cityKey = { phoenix: 'cityPhoenix', miami: 'cityMiami', houston: 'cityHouston' };
const sectorKey = { hvac: 'sectorHvac', plumbing: 'sectorPlumbing', roofing: 'sectorRoofing' };
const scoreLabels = { demand: 'demand', revenue: 'revenue', evidence: 'evidenceStrength', urgency: 'urgency' };
function cityName(city) { return t[cityKey[city.id]] || city.name; }
function sectorName(id) { return t[sectorKey[id]] || sectors[id].label; }
function recordScore(record) { return scenarioFor(record); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function addHistory(key, detail='') {
  history.unshift({ key, detail, time: new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit' }).format(new Date()) });
  renderHistory();
}
function initFilters() {
  const select = $('locationFilter');
  for (const city of cities) {
    const opt = document.createElement('option'); opt.value = city.id; opt.textContent = cityName(city); select.append(opt);
  }
}
function filteredRecords() {
  const q = $('searchFilter').value.trim().toLocaleLowerCase(lang);
  return demoRecords.filter(record => {
    const city = cities.find(c => c.id === record.cityId);
    const haystack = `${cityName(city)} ${city.country} ${sectorName(record.sector)} ${t[typeKey[record.type]]} ${t[record.signalKey]}`.toLocaleLowerCase(lang);
    return (!$('locationFilter').value || $('locationFilter').value === 'all' || record.cityId === $('locationFilter').value)
      && (!$('sectorFilter').value || $('sectorFilter').value === 'all' || record.sector === $('sectorFilter').value)
      && (!$('typeFilter').value || $('typeFilter').value === 'all' || record.type === $('typeFilter').value)
      && (!$('priorityFilter').value || $('priorityFilter').value === 'all' || record.priorityBand === $('priorityFilter').value)
      && $('verificationFilter').value === 'unverified'
      && (!q || haystack.includes(q));
  }).sort((a,b) => recordScore(b).score - recordScore(a).score);
}
function renderKpis() {
  $('kpiCount').textContent = filtered.length;
  const current = filtered.find(r => r.id === selectedId) || filtered[0];
  $('kpiPriority').textContent = current ? `${recordScore(current).score} / 100` : '—';
}
function renderList() {
  $('resultCount').textContent = filtered.length;
  const list = $('opportunityList'); list.replaceChildren();
  if (!filtered.length) { const empty = document.createElement('div'); empty.className='empty'; empty.textContent=t.noResults; list.append(empty); return; }
  filtered.forEach(record => {
    const city = cities.find(c => c.id === record.cityId), score = recordScore(record);
    const button = document.createElement('button'); button.type='button'; button.className='opp-item'+(record.id===selectedId?' selected':'');
    button.setAttribute('aria-pressed', String(record.id===selectedId)); button.dataset.recordId=record.id;
    button.innerHTML = `<span><span class="opp-title">${escapeHtml(sectorName(record.sector))}</span><span class="opp-meta">${escapeHtml(cityName(city))} · ${escapeHtml(t[typeKey[record.type]])}</span></span><span class="opp-right"><span class="opp-score">${score.score}/100</span><br><span class="badge">${escapeHtml(t[priorityKey[record.priorityBand]])}</span></span>`;
    button.addEventListener('click',()=>selectRecord(record.id,true)); list.append(button);
  });
}
function renderDossier() {
  const record=demoRecords.find(r=>r.id===selectedId);
  const root=$('dossierContent'); root.replaceChildren();
  if (!record) { const empty=document.createElement('div');empty.className='empty';empty.textContent=t.dossierPrompt;root.append(empty);return; }
  const score=recordScore(record), city=score.city;
  const title=document.createElement('div');title.className='dossier-top';
  title.innerHTML=`<div><h2>${escapeHtml(sectorName(record.sector))}</h2><p>${escapeHtml(cityName(city))} · ${escapeHtml(t[typeKey[record.type]])}</p></div><span class="badge">${escapeHtml(t.demo)}</span>`;root.append(title);
  const sections=document.createElement('div');sections.className='dossier-sections';
  const addSection=(label,content)=>{const section=document.createElement('section');section.className='dossier-section';section.innerHTML=`<div class="dossier-label">${escapeHtml(label)}</div><div class="dossier-content">${content}</div>`;sections.append(section);};
  addSection(t.signal,escapeHtml(t[record.signalKey]));
  addSection(t.whyMatters,escapeHtml(t[record.actionKey]));
  addSection(t.estimatedValue,`<div class="value-range">${money(score.low)}–${money(score.high)}</div><div class="formula">${escapeHtml(t.monthly)} · ${escapeHtml(t.formulaDetail)}</div>`);
  const scoreContent=`<div class="score-big">${score.score} / 100</div><div class="formula">${escapeHtml(t.scoreModel)}</div><div class="score-bars">${Object.entries(score.dimensions).map(([key,value])=>`<div><div class="score-bar-head"><span>${escapeHtml(t[scoreLabels[key]])}</span><span>${value}/100</span></div><div class="track"><div class="fill" style="width:${value}%"></div></div></div>`).join('')}</div>`;
  addSection(t.priorityScore,scoreContent);
  addSection(t.evidence,escapeHtml(t.noEvidence));
  addSection(t.verificationState,`<span class="badge red">${escapeHtml(t.unverified)}</span><div class="formula">${escapeHtml(t.verifyHint)}</div>`);
  addSection(t.recommendedAction,escapeHtml(t[record.actionKey]));
  root.append(sections);
}
function renderHistory() {
  const root=$('historyList');root.replaceChildren();
  if (!history.length) return;
  history.forEach(item=>{const row=document.createElement('div');row.className='history-item';row.textContent=`${item.time} · ${t[item.key]}${item.detail?` · ${item.detail}`:''}`;root.append(row);});
  $('history').querySelector('.section-head p').textContent=`${history.length} · ${lang.toUpperCase()}`;
}
function renderAll() {
  filtered=filteredRecords();
  if (!filtered.some(r=>r.id===selectedId)) selectedId=filtered[0]?.id || null;
  renderList();renderDossier();renderKpis();renderHistory();syncMapMarkers();
}
function selectRecord(id, focusMap=false) {
  selectedId=id;
  const record=demoRecords.find(r=>r.id===id);if(record){$('locationFilter').value=record.cityId;$('sectorFilter').value=record.sector;filtered=filteredRecords();renderList();renderDossier();renderKpis();syncMapMarkers();if(focusMap&&mapController)focusCity(record.cityId,'city');}
}
function updateMapStatus(loaded) {
  $('mapStatusText').textContent=loaded?t.mapLoaded:t.mapOff;
  $('mapStatusDot').classList.toggle('off',!loaded);
}
function syncMapMarkers() { if(mapController)mapController.render(filtered); }
function selectedCityId() { return demoRecords.find(r=>r.id===selectedId)?.cityId || cities[0].id; }
function focusCity(cityId,view='city') {
  mapView=view;mapController?.setView(view,cityId);
  document.querySelectorAll('[data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===view));
}
function setMapView(view) {
  const cityId=$('locationFilter').value!=='all' ? $('locationFilter').value : selectedCityId();
  focusCity(cityId,view);
}
function currentMapLayers() {
  return {markers:document.querySelector('[data-layer=\"markers\"]').checked,leakage:document.querySelector('[data-layer=\"leakage\"]').checked,demand:document.querySelector('[data-layer=\"demand\"]').checked};
}
async function loadMap() {
  if(mapController)return;
  $('loadMap').disabled=true;$('loadMapEmpty').disabled=true;$('loadMap').textContent=t.mapLoading;$('loadMapEmpty').textContent=t.mapLoading;
  try {
    mapController=await new OpportunityMap({containerId:'map',records:filtered,layers:currentMapLayers(),labels:t,onSelect:id=>selectRecord(id,false),onTileError:()=>{mapTileErrors++;if(mapTileErrors===3)showToast(t.mapError);}}).mount(mapView,selectedCityId());
    $('mapPlaceholder').hidden=true;updateMapStatus(true);syncMapMarkers();
  } catch(error) { mapController=null;$('mapPlaceholder').hidden=false;showToast(t.mapError); }
  finally { $('loadMap').disabled=false;$('loadMapEmpty').disabled=false;$('loadMap').textContent=t.loadMap;$('loadMapEmpty').textContent=t.loadMap; }
}
function refreshScenario() {
  if(!filtered.length){showToast(t.noResults);return;}
  selectedId=filtered[0].id;renderList();renderDossier();renderKpis();
  const record=demoRecords.find(r=>r.id===selectedId);$('locationFilter').value=record.cityId;$('sectorFilter').value=record.sector;
  filtered=filteredRecords();renderList();renderDossier();renderKpis();syncMapMarkers();focusCity(record.cityId,'city');
  addHistory('historyScan',`${cityName(cities.find(c=>c.id===record.cityId))} · ${sectorName(record.sector)}`);
}
function showToast(message) { const toast=$('toast');toast.textContent=message;toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.hidden=true,2400); }
function updateChecklist() {const count=document.querySelectorAll('.evidence-check:checked').length;$('checkProgress').firstChild.textContent=String(count);}
function openDraft() {
  const record=demoRecords.find(r=>r.id===selectedId);if(!record)return;
  const score=recordScore(record),city=score.city;
  $('draftText').value=`${t.draftSubject}\n\n${t.draftScenarioLabel}: ${sectorName(record.sector)} · ${cityName(city)}\n${t.draftValueLabel}: ${money(score.low)}–${money(score.high)} · ${t.monthly} (${t.draftAssumptionNote}).\n\n${t.draftNextStepLabel}: ${t[record.actionKey]} ${t.draftGuardrail}\n\n${t.draftNoContact}`;
  $('draftPanel').hidden=false;$('reviewState').textContent=t.notReviewed;addHistory('historyDraft',cityName(city));
}
function changeLanguage(next) {
  lang=translations[next]?next:'en';t=applyLanguage(lang);$('languageSelect').value=lang;
  const citySelect=$('locationFilter'),value=citySelect.value;citySelect.querySelectorAll('option:not(:first-child)').forEach(option=>option.remove());
  cities.forEach(city=>{const option=document.createElement('option');option.value=city.id;option.textContent=cityName(city);citySelect.append(option);});citySelect.value=value;
  document.querySelectorAll('[data-layer]').forEach(input=>{const key={markers:'layerSignals',leakage:'layerLeakage',demand:'layerDemand'}[input.dataset.layer];input.closest('label').lastElementChild.textContent=t[key];});
  if(mapController){mapController.updateLabels(t);updateMapStatus(true);}
  $('mapMarkerNotice').textContent=t.markerNotice;renderAll();
}

initFilters();$('languageSelect').value=lang;changeLanguage(lang);
$('searchFilter').addEventListener('input',renderAll);['locationFilter','sectorFilter','typeFilter','priorityFilter','verificationFilter'].forEach(id=>$(id).addEventListener('change',()=>{renderAll();addHistory('historyFilter');if(id==='locationFilter'&&mapController&&$('locationFilter').value!=='all')focusCity($('locationFilter').value,'city');}));
$('clearFilters').addEventListener('click',()=>{$('searchFilter').value='';$('locationFilter').value='all';$('sectorFilter').value='all';$('typeFilter').value='all';$('priorityFilter').value='all';$('verificationFilter').value='unverified';renderAll();});
$('languageSelect').addEventListener('change',event=>changeLanguage(event.target.value));
$('loadMap').addEventListener('click',loadMap);$('loadMapEmpty').addEventListener('click',loadMap);
$('refreshScenario').addEventListener('click',refreshScenario);
document.querySelectorAll('[data-layer]').forEach(input=>input.addEventListener('change',()=>{if(mapController)mapController.updateLayers(currentMapLayers());}));
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setMapView(button.dataset.view)));
document.querySelectorAll('.evidence-check').forEach(input=>input.addEventListener('change',updateChecklist));
$('prepareDraft').addEventListener('click',openDraft);$('closeDraft').addEventListener('click',()=>{$('draftPanel').hidden=true;});
$('copyDraft').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('draftText').value);showToast(t.copied);}catch{$('draftText').select();showToast(t.copyManual);}});
$('markReviewed').addEventListener('click',()=>{$('reviewState').textContent=t.reviewedLocal;addHistory('reviewedLocal');});
renderAll();
