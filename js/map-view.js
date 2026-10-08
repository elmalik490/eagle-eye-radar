import { cities, regions } from './demo-data.js';
import { scenarioFor } from './scoring.js';

const escapeHtml=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function loadLeaflet(){
  if(window.L)return Promise.resolve();
  if(loadLeaflet.pending)return loadLeaflet.pending;
  loadLeaflet.pending=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=new URL('../vendor/leaflet/leaflet.js',import.meta.url).href;
    script.onload=()=>resolve();script.onerror=()=>reject(new Error('Local Leaflet library unavailable'));document.head.append(script);
  });
  return loadLeaflet.pending;
}
const worldZoomFor=map=>{
  const width=map.getSize().x||window.innerWidth||360;
  const targetWidth=Math.max(280,width*.91);
  return Math.max(.25,Math.min(2.25,Math.floor(Math.log2(targetWidth/256)*4)/4));
};

// Local Natural Earth geometry is a cartographic backdrop; markers remain synthetic city anchors.
export class OpportunityMap{
  constructor({containerId,records,onSelect,onCountrySelect,onTileError,labels,selectedId}){
    Object.assign(this,{containerId,records,onSelect,onCountrySelect,onTileError,labels,selectedId});
    this.map=null;this.countryGeo=null;this.markerLayer=null;this.countryFeatures=new Map();this.tileLayer=null;this.tilesEnabled=false;
  }
  async mount(){
    await loadLeaflet();
    this.map=L.map(this.containerId,{worldCopyJump:true,scrollWheelZoom:false,keyboard:true,keyboardPanDelta:70,zoomSnap:.25,zoomDelta:.5,minZoom:.25,maxZoom:12,preferCanvas:true,zoomAnimation:false,fadeAnimation:false,inertia:false,attributionControl:true}).setView([20,0],1,{animate:false});
    const response=await fetch(new URL('../data/countries-110m.geojson',import.meta.url));
    if(!response.ok)throw new Error(`Local world geography unavailable (${response.status})`);
    const data=await response.json();
    this.countryGeo=L.geoJSON(data,{style:()=>({color:'#355764',weight:.7,opacity:.9,fillColor:'#16313e',fillOpacity:.88,interactive:true}),
      onEachFeature:(feature,layer)=>{
        const code=feature.properties?.iso_a3;if(code&&code!=='-99')this.countryFeatures.set(code,layer);
        layer.on({mouseover:event=>event.target.setStyle({color:'#71b7c1',weight:1.15,fillColor:'#204653'}),mouseout:event=>this.countryGeo.resetStyle(event.target),click:()=>{if(code&&code!=='-99')this.onCountrySelect?.(code,feature.properties?.name||code);}});
      }
    }).addTo(this.map);
    this.markerLayer=L.layerGroup().addTo(this.map);
    this.map.attributionControl.addAttribution('Made with <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>');
    this.render(this.records,this.selectedId);this.setView('world');
    requestAnimationFrame(()=>this.map.invalidateSize());
    return this;
  }
  updateLabels(labels){this.labels=labels;this.render(this.records,this.selectedId);}
  render(records,selectedId=this.selectedId){
    this.records=records;this.selectedId=selectedId;if(!this.map||!this.markerLayer)return;
    this.markerLayer.clearLayers();
    for(const record of records){
      const city=cities.find(item=>item.id===record.cityId);if(!city)continue;
      const scored=scenarioFor(record);const selected=record.id===selectedId;
      const label=city.names[this.labels.lang]||city.names.en;
      const country=city.countries[this.labels.lang]||city.countries.en;
      const type=this.labels.typeName?.(record.type)||record.type;
      const title=`${label}, ${country} · ${type} · ${this.labels.demo} · ${this.labels.unverified}`;
      const icon=L.divIcon({className:'radar-marker-icon',html:`<span class="radar-marker type-${escapeHtml(record.type)} priority-${scored.priorityBand}${selected?' selected':''}" aria-hidden="true"></span>`,iconSize:[selected?27:21,selected?27:21],iconAnchor:[selected?13.5:10.5,selected?13.5:10.5]});
      const marker=L.marker([city.lat,city.lng],{icon,title,keyboard:true,alt:title,riseOnHover:true});
      marker.bindTooltip(escapeHtml(`${label} · ${country}`),{direction:'top',offset:[0,-9],opacity:.96});
      marker.on('click',()=>this.onSelect?.(record.id,'map'));
      this.markerLayer.addLayer(marker);
    }
  }
  setView(view,{cityId=null,regionId=null,countryCode=null}={}){
    if(!this.map)return;
    if(view==='world'){this.map.setView([20,0],worldZoomFor(this.map),{animate:false});return;}
    if(view==='region'){
      const requestedId=regionId||cities.find(item=>item.id===cityId)?.regionId||'northAmerica';
      const id=Object.prototype.hasOwnProperty.call(regions,requestedId)?requestedId:'northAmerica';
      const centers={northAmerica:[43,-100,3],southAmerica:[-22,-58,3],europe:[52,13,4],africa:[2,18,3],middleEast:[25,45,3.5],asia:[30,100,2.75],oceania:[-25,145,3]};
      const [lat,lng,zoom]=centers[id]||[24,5,2.75];
      this.map.setView([lat,lng],zoom,{animate:false});return;
    }
    const city=cities.find(item=>item.id===cityId)||cities[0];
    if(view==='country'){
      const feature=this.countryFeatures.get(countryCode||city.countryCode);
      if(feature){const center=feature.getBounds().getCenter();this.map.setView(center,4.5,{animate:false});return;}
      this.map.setView([city.lat,city.lng],4.5,{animate:false});return;
    }
    this.map.setView([city.lat,city.lng],6.5,{animate:false});
  }
  focusRecord(record){const city=cities.find(item=>item.id===record?.cityId);if(city)this.map?.setView([city.lat,city.lng],6.5,{animate:false});}
  reset(){this.setView('world');}
  setTilesEnabled(enabled){
    if(!this.map)return false;
    if(enabled&&!this.tileLayer){
      this.tileLayer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,maxNativeZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',updateWhenIdle:true,keepBuffer:1,detectRetina:false});
      this.tileLayer.on('tileerror',()=>this.onTileError?.());
    }
    if(enabled&&!this.map.hasLayer(this.tileLayer))this.tileLayer.addTo(this.map);
    if(!enabled&&this.tileLayer&&this.map.hasLayer(this.tileLayer))this.map.removeLayer(this.tileLayer);
    this.tilesEnabled=Boolean(enabled);return true;
  }
  invalidateSize(){this.map?.invalidateSize({animate:false});}
  setFullscreen(enabled){document.getElementById(this.containerId)?.closest('.map-shell')?.classList.toggle('fullscreen',Boolean(enabled));requestAnimationFrame(()=>this.invalidateSize());}
}
