import { cities } from './demo-data.js';

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

// Real map geometry is kept separate from all synthetic intelligence fixtures.
export class OpportunityMap {
  constructor({containerId,records,onSelect,onTileError,labels,layers}) {
    this.containerId=containerId;this.records=records;this.onSelect=onSelect;this.onTileError=onTileError;
    this.labels=labels;this.layers=layers;this.map=null;this.tileLayer=null;this.markers=null;this.leakage=null;this.demand=null;
  }
  async mount(view,selectedCityId) {
    await loadLeaflet();
    const city=cities.find(item=>item.id===selectedCityId)||cities[0];
    const initial=view==='world'?[[25,-12],2]:view==='country'?[[39.2,-97.4],4]:[[city.lat,city.lng],9];
    this.map=L.map(this.containerId,{worldCopyJump:true,scrollWheelZoom:false,preferCanvas:true,zoomAnimation:false,fadeAnimation:false}).setView(initial[0],initial[1],{animate:false});
    this.tileLayer=L.tileLayer(this.tileUrl,{maxZoom:16,attribution:this.attribution,updateWhenIdle:true,keepBuffer:1});
    this.tileLayer.on('tileerror',()=>this.onTileError?.());this.tileLayer.addTo(this.map);
    this.markers=L.layerGroup().addTo(this.map);this.leakage=L.layerGroup().addTo(this.map);this.demand=L.layerGroup().addTo(this.map);
    this.render(this.records);setTimeout(()=>this.map.invalidateSize(),60);
    return this;
  }
  get tileUrl() { return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'; }
  get attribution() { return `<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">${esc(this.labels.osmAttribution)}</a>`; }
  updateLabels(labels) { this.labels=labels;if(this.tileLayer)this.tileLayer.setAttribution(this.attribution);this.render(this.records); }
  updateLayers(layers) { this.layers=layers;this.render(this.records); }
  render(records) {
    this.records=records;if(!this.map)return;
    this.markers.clearLayers();this.leakage.clearLayers();this.demand.clearLayers();
    cities.forEach(city=>{
      const cityRecords=records.filter(record=>record.cityId===city.id);if(!cityRecords.length)return;
      if(this.layers.markers){
        const icon=L.divIcon({className:'',html:'<span class="synthetic-marker" style="display:block;width:16px;height:16px"></span>',iconSize:[16,16],iconAnchor:[8,8]});
        const marker=L.marker([city.lat,city.lng],{icon,title:`${this.labels[city.nameKey]||city.name} · ${this.labels.cityMarker}`});
        marker.bindPopup(`<strong>${esc(this.labels[city.nameKey]||city.name)}</strong><br>${esc(this.labels.cityMarker)}<br><span>${cityRecords.length} · ${esc(this.labels.demo)} · ${esc(this.labels.unverified)}</span>`);
        marker.on('click',()=>this.onSelect(cityRecords[0].id));this.markers.addLayer(marker);
      }
      if(this.layers.leakage){const circle=L.circle([city.lat,city.lng],{radius:19000,color:'#f0c36e',fillColor:'#f0c36e',fillOpacity:.15,weight:1});circle.bindTooltip(`${esc(this.labels.layerLeakage)} · ${esc(this.labels.demo)}`);this.leakage.addLayer(circle);}
      if(this.layers.demand){const circle=L.circle([city.lat+.13,city.lng+.12],{radius:33000,color:'#61d7ad',fillColor:'#61d7ad',fillOpacity:.12,weight:1});circle.bindTooltip(`${esc(this.labels.layerDemand)} · ${esc(this.labels.demo)}`);this.demand.addLayer(circle);}
    });
  }
  setView(view,cityId) {
    if(!this.map)return;
    const city=cities.find(item=>item.id===cityId)||cities[0];
    const target=view==='world'?[[25,-12],2]:view==='country'?[[39.2,-97.4],4]:[[city.lat,city.lng],10];
    this.map.setView(target[0],target[1],{animate:false});
  }
}
