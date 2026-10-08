import { cities } from './demo-data.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const markerColors={missedDemand:0x00f0ff,serviceGap:0x10b981,followUpGap:0xa855f7,operationalWaste:0xeab308};

function spherePoint(THREE,lat,lng,radius=1){
  const p=lat*Math.PI/180,l=lng*Math.PI/180,c=Math.cos(p);
  return new THREE.Vector3(radius*c*Math.cos(l),radius*Math.sin(p),-radius*c*Math.sin(l));
}
function projectRing(ring,width,height){
  let previous=null;
  return ring.map(([rawLng,lat])=>{
    let lng=rawLng;
    if(previous!==null){while(lng-previous>180)lng-=360;while(lng-previous< -180)lng+=360;}
    previous=lng;
    return [lng,lat];
  });
}
function traceWrapped(ctx,points,width,height,fill,stroke){
  const unwrapped=projectRing(points,width,height);
  for(const shift of [-360,0,360]){
    ctx.beginPath();
    unwrapped.forEach(([lng,lat],index)=>{
      const x=((lng+shift+180)/360)*width,y=((90-lat)/180)*height;
      if(index===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill('evenodd');}
    if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
  }
}
function drawGeometry(ctx,geometry,width,height){
  if(!geometry)return;
  const land='rgba(8,47,62,.98)',water='rgba(5,17,27,.98)',stroke='rgba(0,240,255,.62)';
  ctx.lineWidth=.7;
  const polygon=rings=>rings.forEach((ring,index)=>traceWrapped(ctx,ring,width,height,index===0?land:water,stroke));
  if(geometry.type==='Polygon')polygon(geometry.coordinates);
  else if(geometry.type==='MultiPolygon')geometry.coordinates.forEach(polygon);
}

/** Local-only Three.js globe. Every point supplied to this view is a fictional city anchor. */
export class WorldGlobe{
  constructor({containerId,records,selectedId,onSelect,onFallback,onStatus,onRotationChange,labels}){
    Object.assign(this,{containerId,records,selectedId,onSelect,onFallback,onStatus,onRotationChange,labels});
    this.active=false;this.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;this.frameId=0;this.disposed=false;this.degraded=false;this.lowPerfWindows=0;this.fallbackSent=false;this.pointerMap=new Map();this.view='world';
  }
  async mount(){
    this.container=document.getElementById(this.containerId);
    if(!this.container)throw new Error('Globe canvas host is missing');
    // Local, pinned library files; no CDN or remote module is used.
    this.THREE=await import('../vendor/three/three.module.js');
    const T=this.THREE;
    const canvas=document.createElement('canvas'),context=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:false});
    if(!context)throw new Error('WebGL2 unavailable');
    this.renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:false});
    this.renderer.setClearColor(0x070a12,0);
    this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.scene=new T.Scene();
    this.camera=new T.PerspectiveCamera(33,1,.1,40);
    this.camera.position.set(0,0,3.45);
    this.earthGroup=new T.Group();
    this.scene.add(this.earthGroup);
    const mapTexture=await this.#buildTexture();
    this.mapTexture=mapTexture;
    this.earthGeometry=new T.SphereGeometry(1,64,48);
    this.earthMaterial=new T.MeshBasicMaterial({map:mapTexture,color:0xb4f5ff});
    this.earth=new T.Mesh(this.earthGeometry,this.earthMaterial);
    this.earthGroup.add(this.earth);
    this.#addGrid();
    this.#addAtmosphereAndRings();
    this.markerGroup=new T.Group();
    this.earthGroup.add(this.markerGroup);
    this.markerGeometry=new T.SphereGeometry(.018,10,8);
    this.haloGeometry=new T.SphereGeometry(.036,10,8);
    this.markerMaterials=new Map();
    this.haloMaterials=new Map();
    this.raycaster=new T.Raycaster();
    this.pointer=new T.Vector2();
    this.render(this.records,this.selectedId);
    this.renderer.domElement.className='globe-canvas';
    this.renderer.domElement.tabIndex=0;
    this.renderer.domElement.setAttribute('role','img');
    this.renderer.domElement.setAttribute('aria-label',this.labels.globeAria||'Interactive globe with synthetic markers');
    this.renderer.domElement.setAttribute('aria-describedby','globeInstructions');
    this.container.replaceChildren(this.renderer.domElement);
    this.resizeObserver=new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(this.container);
    this.#bindPointerEvents();
    this.visibilityHandler=()=>document.hidden?this.#stop():this.#start();
    document.addEventListener('visibilitychange',this.visibilityHandler);
    this.resize();
    this.setView('world');
    this.onStatus?.('ready');
    return this;
  }
  async #buildTexture(){
    const response=await fetch(new URL('../data/countries-110m.geojson',import.meta.url));
    if(!response.ok)throw new Error(`Local world geography unavailable (${response.status})`);
    const data=await response.json();
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.fillStyle='#06121c';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(0,240,255,.10)';ctx.lineWidth=.6;
    for(let lng=-150;lng<=180;lng+=30){const x=(lng+180)/360*canvas.width;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
    for(let lat=-60;lat<=60;lat+=30){const y=(90-lat)/180*canvas.height;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    for(const feature of data.features||[])drawGeometry(ctx,feature.geometry,canvas.width,canvas.height);
    const texture=new this.THREE.CanvasTexture(canvas);
    texture.colorSpace=this.THREE.SRGBColorSpace;
    texture.anisotropy=1;
    texture.needsUpdate=true;
    return texture;
  }
  #addGrid(){
    const T=this.THREE,material=new T.LineBasicMaterial({color:0x1596ad,transparent:true,opacity:.26,depthWrite:false});
    this.gridLines=[];
    for(let lat=-60;lat<=60;lat+=30){
      const points=[];for(let lng=-180;lng<=180;lng+=3)points.push(spherePoint(T,lat,lng,1.004));
      const line=new T.Line(new T.BufferGeometry().setFromPoints(points),material);this.earthGroup.add(line);this.gridLines.push(line);
    }
    for(let lng=-150;lng<=180;lng+=30){
      const points=[];for(let lat=-87;lat<=87;lat+=3)points.push(spherePoint(T,lat,lng,1.004));
      const line=new T.Line(new T.BufferGeometry().setFromPoints(points),material);this.earthGroup.add(line);this.gridLines.push(line);
    }
    this.gridMaterial=material;
  }
  #addAtmosphereAndRings(){
    const T=this.THREE;
    this.atmosphere=new T.Mesh(new T.SphereGeometry(1.045,40,28),new T.MeshBasicMaterial({color:0x00cfe8,transparent:true,opacity:.075,side:T.BackSide,blending:T.AdditiveBlending,depthWrite:false}));
    this.earthGroup.add(this.atmosphere);
    this.rings=[];
    for(const [tilt,opacity] of [[.22,.34],[1.05,.19]]){
      const ring=new T.Mesh(new T.TorusGeometry(1.18,.0032,4,120),new T.MeshBasicMaterial({color:0x00d9ed,transparent:true,opacity,depthWrite:false}));
      ring.rotation.set(tilt,.22,.12);this.earthGroup.add(ring);this.rings.push(ring);
    }
  }
  render(records,selectedId=this.selectedId){
    this.records=records||[];this.selectedId=selectedId;
    if(!this.markerGroup)return;
    this.markerGroup.clear();
    for(const record of this.records){
      const city=cities.find(item=>item.id===record.cityId);if(!city)continue;
      const color=markerColors[record.type]??0x00f0ff;
      if(!this.markerMaterials.has(color)){
        this.markerMaterials.set(color,new this.THREE.MeshBasicMaterial({color}));
        this.haloMaterials.set(color,new this.THREE.MeshBasicMaterial({color,transparent:true,opacity:.22,depthWrite:false,blending:this.THREE.AdditiveBlending}));
      }
      const node=new this.THREE.Group();node.position.copy(spherePoint(this.THREE,city.lat,city.lng,1.012));node.userData.recordId=record.id;node.userData.haloBaseScale=record.id===selectedId?1.34:1;
      const halo=new this.THREE.Mesh(this.haloGeometry,this.haloMaterials.get(color));halo.scale.setScalar(node.userData.haloBaseScale);halo.userData.recordId=record.id;
      const dot=new this.THREE.Mesh(this.markerGeometry,this.markerMaterials.get(color));dot.scale.setScalar(record.id===selectedId?1.42:1);dot.userData.recordId=record.id;dot.renderOrder=2;
      node.add(halo,dot);this.markerGroup.add(node);
    }
  }
  updateLabels(labels){this.labels=labels;if(this.renderer?.domElement)this.renderer.domElement.setAttribute('aria-label',labels.globeAria||'Interactive globe with synthetic markers');}
  setView(view,{cityId=null,regionId=null,countryCode=null}={}){
    if(!this.earth||!this.camera)return;this.view=view;
    if(view==='world'){
      this.earthGroup.rotation.set(.12,-1.42,0);this.camera.position.z=3.45;return;
    }
    let city=cities.find(item=>item.id===cityId);
    if(view==='region')city=cities.find(item=>item.regionId===regionId)||city;
    if(view==='country')city=cities.find(item=>item.countryCode===countryCode)||city;
    city=city||cities[0];
    this.earthGroup.rotation.set(city.lat*Math.PI/180,-Math.PI/2-city.lng*Math.PI/180,0);
    this.camera.position.z=view==='city'?1.95:view==='country'?2.45:2.9;
  }
  focusRecord(record){
    const city=cities.find(item=>item.id===record?.cityId);if(!city||!this.earthGroup)return;
    this.earthGroup.rotation.set(city.lat*Math.PI/180,-Math.PI/2-city.lng*Math.PI/180,0);
    if(this.view==='world')this.camera.position.z=2.85;
  }
  setActive(active){this.active=Boolean(active);if(this.active)this.#start();else this.#stop();if(this.active)requestAnimationFrame(()=>this.resize());}
  #start(){if(!this.active||this.disposed||document.hidden||this.frameId)return;this.sampleStart=performance.now();this.sampleFrames=0;this.lastFrame=this.sampleStart;this.frameId=requestAnimationFrame(time=>this.#frame(time));}
  #stop(){if(this.frameId)cancelAnimationFrame(this.frameId);this.frameId=0;}
  #frame(now){
    this.frameId=0;if(!this.active||this.disposed||document.hidden)return;
    const delta=Math.min(50,Math.max(0,now-this.lastFrame));this.lastFrame=now;
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(this.autoRotate&&!reducedMotion)this.earthGroup.rotation.y+=delta*.000022;
    if(!reducedMotion&&!this.degraded){const pulse=.94+.12*Math.sin(now*.002);for(const node of this.markerGroup.children){const halo=node.children[0];if(halo)halo.scale.setScalar((node.userData.haloBaseScale||1)*pulse);}}
    this.renderer.render(this.scene,this.camera);this.sampleFrames++;
    if(now-this.sampleStart>=2200){
      const fps=this.sampleFrames*1000/(now-this.sampleStart);this.lastFps=Math.round(fps);
      if(fps<27){
        if(!this.degraded){this.degraded=true;if(this.autoRotate)this.setRotation(false);this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1));this.atmosphere.visible=false;this.rings.forEach(ring=>ring.visible=false);this.resize();this.onStatus?.('degraded');this.lowPerfWindows=0;}
        else if(fps<19){this.lowPerfWindows++;if(this.lowPerfWindows>=2&&!this.fallbackSent){this.fallbackSent=true;this.onFallback?.('performance');this.#stop();return;}}
        else this.lowPerfWindows=0;
      }else this.lowPerfWindows=0;
      this.sampleStart=now;this.sampleFrames=0;
    }
    this.frameId=requestAnimationFrame(time=>this.#frame(time));
  }
  resize(){
    if(!this.renderer||!this.camera||!this.container)return;
    const width=this.container.clientWidth,height=this.container.clientHeight;if(width<2||height<2)return;
    const base=width<768?1.2:1.55,ratio=this.degraded?Math.min(window.devicePixelRatio||1,1):Math.min(window.devicePixelRatio||1,base);
    this.renderer.setPixelRatio(ratio);this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();
  }
  zoomBy(amount){if(this.camera)this.camera.position.z=clamp(this.camera.position.z+amount,1.65,5.25);}
  setRotation(enabled){this.autoRotate=Boolean(enabled);this.onRotationChange?.(this.autoRotate);return this.autoRotate;}
  #bindPointerEvents(){
    const canvas=this.renderer.domElement;
    this.onPointerDown=event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      canvas.setPointerCapture?.(event.pointerId);this.pointerMap.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(this.pointerMap.size===1){this.dragOrigin={x:event.clientX,y:event.clientY};this.lastPointer={x:event.clientX,y:event.clientY};this.didMove=false;}
      if(this.pointerMap.size===2){const pts=[...this.pointerMap.values()];this.pinchDistance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);this.didMove=true;}
    };
    this.onPointerMove=event=>{
      if(!this.pointerMap.has(event.pointerId))return;
      this.pointerMap.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(this.pointerMap.size>=2){const pts=[...this.pointerMap.values()],distance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);if(this.pinchDistance)this.zoomBy((this.pinchDistance-distance)*.006);this.pinchDistance=distance;this.didMove=true;return;}
      const dx=event.clientX-this.lastPointer.x,dy=event.clientY-this.lastPointer.y;this.lastPointer={x:event.clientX,y:event.clientY};
      if(Math.hypot(event.clientX-this.dragOrigin.x,event.clientY-this.dragOrigin.y)>4){this.didMove=true;this.earthGroup.rotation.y+=dx*.006;this.earthGroup.rotation.x=clamp(this.earthGroup.rotation.x+dy*.006,-1.35,1.35);if(this.autoRotate)this.setRotation(false);}
    };
    this.onPointerUp=event=>{
      const wasSingle=this.pointerMap.size===1;this.pointerMap.delete(event.pointerId);this.pinchDistance=0;
      if(wasSingle&&!this.didMove)this.#selectAt(event.clientX,event.clientY);
    };
    this.onPointerCancel=event=>{this.pointerMap.delete(event.pointerId);this.pinchDistance=0;};
    this.onWheel=event=>{event.preventDefault();this.zoomBy(event.deltaY*.0024);};
    this.onContextLost=event=>{event.preventDefault();if(!this.fallbackSent){this.fallbackSent=true;this.onFallback?.('context');this.#stop();}};
    this.onKey=event=>{
      const step=.09;
      if(event.key==='ArrowLeft'){this.earthGroup.rotation.y-=step;event.preventDefault();}
      else if(event.key==='ArrowRight'){this.earthGroup.rotation.y+=step;event.preventDefault();}
      else if(event.key==='ArrowUp'){this.earthGroup.rotation.x=clamp(this.earthGroup.rotation.x-step,-1.35,1.35);event.preventDefault();}
      else if(event.key==='ArrowDown'){this.earthGroup.rotation.x=clamp(this.earthGroup.rotation.x+step,-1.35,1.35);event.preventDefault();}
      else if(event.key==='+'||event.key==='='){this.zoomBy(-.2);event.preventDefault();}
      else if(event.key==='-'){this.zoomBy(.2);event.preventDefault();}
      else if(event.key===' '){this.setRotation(!this.autoRotate);event.preventDefault();}
    };
    canvas.addEventListener('pointerdown',this.onPointerDown);canvas.addEventListener('pointermove',this.onPointerMove);canvas.addEventListener('pointerup',this.onPointerUp);canvas.addEventListener('pointercancel',this.onPointerCancel);canvas.addEventListener('wheel',this.onWheel,{passive:false});canvas.addEventListener('webglcontextlost',this.onContextLost);canvas.addEventListener('keydown',this.onKey);
  }
  #selectAt(clientX,clientY){
    const rect=this.renderer.domElement.getBoundingClientRect();if(!rect.width||!rect.height)return;
    this.pointer.set(((clientX-rect.left)/rect.width)*2-1,-((clientY-rect.top)/rect.height)*2+1);
    this.raycaster.setFromCamera(this.pointer,this.camera);
    const hits=this.raycaster.intersectObjects([this.earth,...this.markerGroup.children],true);
    const hit=hits[0]?.object?.userData?.recordId;
    if(hit)this.onSelect?.(hit,'globe');
  }
  dispose(){
    this.disposed=true;this.#stop();document.removeEventListener('visibilitychange',this.visibilityHandler);this.resizeObserver?.disconnect();
    const canvas=this.renderer?.domElement;
    if(canvas){canvas.removeEventListener('pointerdown',this.onPointerDown);canvas.removeEventListener('pointermove',this.onPointerMove);canvas.removeEventListener('pointerup',this.onPointerUp);canvas.removeEventListener('pointercancel',this.onPointerCancel);canvas.removeEventListener('wheel',this.onWheel);canvas.removeEventListener('webglcontextlost',this.onContextLost);canvas.removeEventListener('keydown',this.onKey);}
    this.earthGeometry?.dispose();this.earthMaterial?.dispose();this.mapTexture?.dispose();this.markerGeometry?.dispose();this.haloGeometry?.dispose();this.markerMaterials?.forEach(material=>material.dispose());this.haloMaterials?.forEach(material=>material.dispose());this.gridLines?.forEach(line=>line.geometry.dispose());this.gridMaterial?.dispose();this.atmosphere?.geometry.dispose();this.atmosphere?.material.dispose();this.rings?.forEach(ring=>{ring.geometry.dispose();ring.material.dispose();});this.renderer?.dispose();this.renderer?.domElement.remove();
  }
}
