import { cities } from './demo-data.js';
import { scenarioFor } from './scoring.js';

const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (loadLeaflet.pending) return loadLeaflet.pending;
  loadLeaflet.pending = new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='vendor/leaflet/leaflet.js';
    script.onload=()=>resolve();script.onerror=()=>reject(new Error('Local Leaflet library unavailable'));
    document.head.append(script);
  });
  return loadLeaflet.pending;
}

// OSM is map geometry only; all opportunity overlays are synthetic city-level illustrations.
export class OpportunityMap {
  constructor({containerId,records,onSelect,onTileError,labels,layers,selectedId}) {
    this.containerId=containerId;this.records=records;this.onSelect=onSelect;this.onTileError=onTileError;
    this.labels=labels;this.layers=layers;this.selectedId=selectedId;this.map=null;this.tileLayer=null;
    this.markers=null;this.leakage=null;this.demand=null;this.priority=null;this.verification=null;this.risk=null;
  }
  async mount(view,selectedCityId) {
    await loadLeaflet();
    const city=cities.find(item=>item.id===selectedCityId)||cities[0];
    const initial=view==='world'?[[25,-12],2]:view==='country'?[[39.2,-97.4],4]:[[city.lat,city.lng],9];
    this.map=L.map(this.containerId,{worldCopyJump:true,scrollWheelZoom:false,preferCanvas:true,zoomAnimation:false,fadeAnimation:false}).setView(initial[0],initial[1],{animate:false});
    this.tileLayer=L.tileLayer(this.tileUrl,{maxZoom:16,attribution:this.attribution,updateWhenIdle:true,keepBuffer:1});
    this.tileLayer.on('tileerror',()=>this.onTileError?.());this.tileLayer.addTo(this.map);
    this.markers=L.layerGroup().addTo(this.map);this.leakage=L.layerGroup().addTo(this.map);this.demand=L.layerGroup().addTo(this.map);
    this.priority=L.layerGroup().addTo(this.map);this.verification=L.layerGroup().addTo(this.map);this.risk=L.layerGroup().addTo(this.map);
    this.render(this.records,this.selectedId);setTimeout(()=>this.map.invalidateSize(),60);
    return this;
  }
  get tileUrl() { return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'; }
  get attribution() { return `<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">${esc(this.labels.osmAttribution)}</a>`; }
  updateLabels(labels) { this.labels=labels;if(this.tileLayer)this.tileLayer.setAttribution(this.attribution);this.render(this.records,this.selectedId); }
  updateLayers(layers) { this.layers=layers;this.render(this.records,this.selectedId); }
  render(records,selectedId=this.selectedId) {
    this.records=records;this.selectedId=selectedId;if(!this.map)return;
    for(const layer of [this.markers,this.leakage,this.demand,this.priority,this.verification,this.risk])layer.clearLayers();
    cities.forEach(city=>{
      const cityRecords=records.filter(record=>record.cityId===city.id);if(!cityRecords.length)return;
      const citySelected=cityRecords.some(record=>record.id===selectedId);
      const topScore=Math.max(...cityRecords.map(record=>scenarioFor(record).score));
      const band=topScore>=58?'high':topScore>=50?'medium':'low';
      if(this.layers.markers){
        const icon=L.divIcon({className:'',html:`<span class="synthetic-marker priority-${band}${citySelected?' selected':''}" style="display:block;width:${citySelected?21:16}px;height:${citySelected?21:16}px"></span>`,iconSize:[citySelected?21:16,citySelected?21:16],iconAnchor:[citySelected?10.5:8,citySelected?10.5:8]});
        const marker=L.marker([city.lat,city.lng],{icon,title:`${this.labels[city.nameKey]||city.name} · ${this.labels.cityMarker}${citySelected?` · ${this.labels.legendSelected}`:''}`});
        marker.bindPopup(`<strong>${esc(this.labels[city.nameKey]||city.name)}</strong><br>${esc(this.labels.cityMarker)}<br><span>${cityRecords.length} · ${esc(this.labels.demo)} · ${esc(this.labels.unverified)}</span>`);
        marker.on('click',()=>this.onSelect(cityRecords[0].id));this.markers.addLayer(marker);
      }
      if(this.layers.leakage){const circle=L.circle([city.lat,city.lng],{radius:19000,color:'#f0c36e',fillColor:'#f0c36e',fillOpacity:.15,weight:1});circle.bindTooltip(`${esc(this.labels.layerLeakage)} · ${esc(this.labels.demo)}`);this.leakage.addLayer(circle);}
      if(this.layers.demand){const circle=L.circle([city.lat+.13,city.lng+.12],{radius:33000,color:'#61d7ad',fillColor:'#61d7ad',fillOpacity:.12,weight:1});circle.bindTooltip(`${esc(this.labels.layerDemand)} · ${esc(this.labels.demo)}`);this.demand.addLayer(circle);}
      if(this.layers.priority){const dot=L.circleMarker([city.lat,city.lng],{radius:10,color:'#f0c36e',weight:2,fillColor:'#f0c36e',fillOpacity:.18});dot.bindTooltip(`${esc(this.labels.mapPriority)} · ${topScore}/100 · ${esc(this.labels.demo)}`);this.priority.addLayer(dot);}
      if(this.layers.verification){const ring=L.circleMarker([city.lat,city.lng],{radius:15,color:'#e3a2a2',weight:2,dashArray:'2 4',fillOpacity:0});ring.bindTooltip(`${esc(this.labels.mapVerification)} · ${esc(this.labels.unverified)}`);this.verification.addLayer(ring);}
      if(this.layers.risk){const ring=L.circleMarker([city.lat,city.lng],{radius:20,color:'#d69861',weight:1,dashArray:'3 4',fillOpacity:0});ring.bindTooltip(`${esc(this.labels.mapRisk)} · ${esc(this.labels.notAssessed)}`);this.risk.addLayer(ring);}
    });
  }
  setView(view,cityId) {
    if(!this.map)return;
    const city=cities.find(item=>item.id===cityId)||cities[0];
    const target=view==='world'?[[25,-12],2]:view==='country'?[[39.2,-97.4],4]:[[city.lat,city.lng],10];
    this.map.setView(target[0],target[1],{animate:false});
  }
  resetView(view,cityId){this.setView(view,cityId);}
}
