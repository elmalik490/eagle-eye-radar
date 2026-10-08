import { cities } from './demo-data.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const markerColors={missedDemand:0x00f0ff,serviceGap:0x10b981,followUpGap:0xa855f7,operationalWaste:0xeab308};

function spherePoint(THREE,lat,lng,radius=1){
  const p=lat*Math.PI/180,l=lng*Math.PI/180,c=Math.cos(p);
  return new THREE.Vector3(radius*c*Math.cos(l),radius*Math.sin(p),-radius*c*Math.sin(l));
}
function projectRing(ring){
  let previous=null;
  return ring.map(([rawLng,lat])=>{
    let lng=rawLng;
    if(previous!==null){while(lng-previous>180)lng-=360;while(lng-previous< -180)lng+=360;}
    previous=lng;
    return [lng,lat];
  });
}
function traceWrapped(ctx,points,width,height,fill,stroke){
  const unwrapped=projectRing(points);
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
  constructor({containerId,records,selectedId,onSelect,onFallback,onStatus,onPerformance,onRotationChange,labels}){
    Object.assign(this,{containerId,records,selectedId,onSelect,onFallback,onStatus,onRotationChange,labels});
    this.active=false;
    this.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.frameId=0;this.disposed=false;this.contextLost=false;this.fallbackSent=false;
    this.pointerMap=new Map();this.view='world';this.performanceMode='auto';this.performanceLevel=0;
    this.lowPerfWindows=0;this.fastPerfWindows=0;this.textureVariants=new Map();this.lastFps=null;
    this.renderRetryTimer=0;this.renderRecoveryAttempted=false;this.resizeFrameId=0;this.restoreFrameId=0;
    this.onPerformance=onPerformance;
  }
  async mount(){
    this.container=document.getElementById(this.containerId);
    if(!this.container)throw new Error('Globe canvas host is missing');
    this.pointLabel=document.getElementById('globePointLabel');
    this.THREE=await import('../vendor/three/three.module.js');
    const T=this.THREE,canvas=document.createElement('canvas');
    const context=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:false});
    if(!context)throw new Error('WebGL2 unavailable');
    this.renderer=new T.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:'low-power',failIfMajorPerformanceCaveat:false});
    this.renderer.setClearColor(0x070a12,0);this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(33,1,.1,40);
    this.camera.position.z=window.innerWidth<768?4.7:3.45;
    this.earthGroup=new T.Group();this.scene.add(this.earthGroup);
    const texture=await this.#buildTexture(window.innerWidth<768?512:1024);
    this.mapTexture=texture;
    this.earthGeometry=new T.SphereGeometry(1,window.innerWidth<768?48:64,window.innerWidth<768?36:48);
    this.earthMaterial=new T.MeshBasicMaterial({map:texture,color:0xb4f5ff});
    this.earth=new T.Mesh(this.earthGeometry,this.earthMaterial);this.earthGroup.add(this.earth);
    this.#addGrid();this.#addAtmosphereAndRings();
    this.markerGroup=new T.Group();this.earthGroup.add(this.markerGroup);
    this.markerGeometry=new T.SphereGeometry(.018,10,8);this.haloGeometry=new T.SphereGeometry(.036,10,8);
    this.markerMaterials=new Map();this.haloMaterials=new Map();this.raycaster=new T.Raycaster();this.pointer=new T.Vector2();
    this.render(this.records,this.selectedId);
    canvas.className='globe-canvas';canvas.tabIndex=0;canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label',this.labels.globeAria||'Interactive globe with synthetic markers');
    canvas.setAttribute('aria-describedby','globeInstructions');
    this.container.replaceChildren(canvas);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.container);
    this.#bindPointerEvents();
    this.visibilityHandler=()=>{this.#clearPointers();if(document.hidden)this.#stop();else this.#start();};
    document.addEventListener('visibilitychange',this.visibilityHandler);
    this.setView('world');this.#setPerformanceLevel(this.performanceLevel);this.onStatus?.(this.geographyWarning?'assetDegraded':'ready');
    this.mounted=true;
    return this;
  }
  async #buildTexture(resolution){
    let features=[];
    try{const response=await fetch(new URL('../data/countries-110m.geojson',import.meta.url));if(!response.ok)throw new Error(`Local world geography unavailable (${response.status})`);const data=await response.json();if(!Array.isArray(data.features))throw new Error('Local world geography is malformed');features=data.features;}
    catch(error){this.geographyWarning=true;console.warn('Eagle Eye local country outlines unavailable; rendering the procedural globe texture.',error);}
    const canvas=document.createElement('canvas');
    canvas.width=resolution;canvas.height=resolution/2;
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.fillStyle='#06121c';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(0,240,255,.10)';ctx.lineWidth=.6;
    for(let lng=-150;lng<=180;lng+=30){const x=(lng+180)/360*canvas.width;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
    for(let lat=-60;lat<=60;lat+=30){const y=(90-lat)/180*canvas.height;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
    for(const feature of features)drawGeometry(ctx,feature.geometry,canvas.width,canvas.height);
    this.textureVariants.set(resolution,canvas);
    const texture=new this.THREE.CanvasTexture(canvas);texture.colorSpace=this.THREE.SRGBColorSpace;
    texture.anisotropy=1;texture.needsUpdate=true;return texture;
  }
  #addGrid(){
    const T=this.THREE,mobile=window.innerWidth<768,step=mobile?6:3,latStep=mobile?30:30,lngStep=mobile?60:30;
    const material=new T.LineBasicMaterial({color:0x1596ad,transparent:true,opacity:.26,depthWrite:false});
    this.gridLines=[];
    for(let lat=-60;lat<=60;lat+=latStep){
      const points=[];for(let lng=-180;lng<=180;lng+=step)points.push(spherePoint(T,lat,lng,1.004));
      const line=new T.Line(new T.BufferGeometry().setFromPoints(points),material);this.earthGroup.add(line);this.gridLines.push(line);
    }
    for(let lng=-150;lng<=180;lng+=lngStep){
      const points=[];for(let lat=-87;lat<=87;lat+=step)points.push(spherePoint(T,lat,lng,1.004));
      const line=new T.Line(new T.BufferGeometry().setFromPoints(points),material);this.earthGroup.add(line);this.gridLines.push(line);
    }
    this.gridMaterial=material;
  }
  #addAtmosphereAndRings(){
    const T=this.THREE;
    this.atmosphere=new T.Mesh(new T.SphereGeometry(1.045,40,28),new T.MeshBasicMaterial({color:0x00cfe8,transparent:true,opacity:.075,side:T.BackSide,blending:T.AdditiveBlending,depthWrite:false}));
    this.earthGroup.add(this.atmosphere);this.rings=[];
    for(const [tilt,opacity] of [[.22,.34],[1.05,.19]]){
      const ring=new T.Mesh(new T.TorusGeometry(1.18,.0032,4,120),new T.MeshBasicMaterial({color:0x00d9ed,transparent:true,opacity,depthWrite:false}));
      ring.rotation.set(tilt,.22,.12);this.earthGroup.add(ring);this.rings.push(ring);
    }
  }
  render(records,selectedId=this.selectedId){
    this.records=records||[];this.selectedId=selectedId;this.selectedRecord=this.records.find(record=>record.id===selectedId)||null;if(!this.markerGroup)return;
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
    this.#start();
  }
  updateLabels(labels){this.labels=labels;if(this.renderer?.domElement)this.renderer.domElement.setAttribute('aria-label',labels.globeAria||'Interactive globe with synthetic markers');}
  setView(view,{cityId=null,regionId=null,countryCode=null}={}){
    if(!this.earth||!this.camera)return;this.view=view;
    if(view==='world'){this.earthGroup.rotation.set(.12,-1.42,0);this.camera.position.z=window.innerWidth<768?4.7:3.45;this.#start();return;}
    let city=cities.find(item=>item.id===cityId);
    if(view==='region')city=cities.find(item=>item.regionId===regionId)||city;
    if(view==='country')city=cities.find(item=>item.countryCode===countryCode)||city;
    city=city||cities[0];this.earthGroup.rotation.set(city.lat*Math.PI/180,-Math.PI/2-city.lng*Math.PI/180,0);
    this.camera.position.z=view==='city'?1.95:view==='country'?2.45:2.9;this.#start();
  }
  focusRecord(record){
    const city=cities.find(item=>item.id===record?.cityId);if(!city||!this.earthGroup)return;
    this.earthGroup.rotation.set(city.lat*Math.PI/180,-Math.PI/2-city.lng*Math.PI/180,0);
    if(this.view==='world')this.camera.position.z=2.85;this.#start();
  }
  setActive(active){
    this.active=Boolean(active);
    if(this.active){
      this.fallbackSent=false;
      if(this.contextLost){clearTimeout(this.contextRecoveryTimer);this.contextRecoveryTimer=setTimeout(()=>{if(this.contextLost&&this.active&&!this.disposed)this.#fail('context');},7000);return;}
      this.#start();this.#scheduleResize();
    }else{this.#stop();clearTimeout(this.contextRecoveryTimer);this.contextRecoveryTimer=0;if(this.pointLabel)this.pointLabel.hidden=true;}
  }
  #start(){if(!this.active||this.disposed||this.contextLost||document.hidden||this.frameId)return;this.sampleStart=performance.now();this.sampleFrames=0;this.lastFrame=this.sampleStart;this.frameId=requestAnimationFrame(time=>this.#frame(time));}
  #stop(){if(this.frameId)cancelAnimationFrame(this.frameId);this.frameId=0;}
  #scheduleResize(){if(this.disposed||this.resizeFrameId)return;this.resizeFrameId=requestAnimationFrame(()=>{this.resizeFrameId=0;if(!this.disposed)this.resize();});}
  #frame(now){
    this.frameId=0;if(!this.active||this.disposed||this.contextLost||document.hidden)return;
    const delta=Math.min(50,Math.max(0,now-this.lastFrame));this.lastFrame=now;
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(this.autoRotate&&!reducedMotion)this.earthGroup.rotation.y+=delta*.000022;
    if(!reducedMotion&&this.performanceLevel===0){const pulse=.94+.12*Math.sin(now*.002);for(const node of this.markerGroup.children){const halo=node.children[0];if(halo)halo.scale.setScalar((node.userData.haloBaseScale||1)*pulse);}}
    try{this.renderer.render(this.scene,this.camera);this.#updateSelectedLabel();}catch(error){if(!this.contextLost)this.#fail('render',error);return;}
    this.sampleFrames++;
    if(now-this.sampleStart>=2200){
      this.lastFps=this.sampleFrames*1000/(now-this.sampleStart);
      if(this.performanceMode==='auto'){
        if(this.lastFps<27){this.lowPerfWindows++;this.fastPerfWindows=0;if(this.lowPerfWindows>=1&&this.performanceLevel<2)this.#setPerformanceLevel(this.performanceLevel+1);}
        else if(this.lastFps>38){this.fastPerfWindows++;this.lowPerfWindows=0;if(this.fastPerfWindows>=3&&this.performanceLevel>0)this.#setPerformanceLevel(this.performanceLevel-1);}
        else{this.lowPerfWindows=0;this.fastPerfWindows=0;}
      }
      this.sampleStart=now;this.sampleFrames=0;this.onPerformance?.(this.getPerformanceInfo());
    }
    this.frameId=requestAnimationFrame(time=>this.#frame(time));
  }
  #setPerformanceLevel(level){
    this.performanceLevel=clamp(level,0,2);this.lowPerfWindows=0;this.fastPerfWindows=0;
    const mobile=window.innerWidth<768,base=this.performanceMode==='quality'?(mobile?1.35:1.75):(mobile?1.1:1.5);
    const ratio=this.performanceLevel===0?base:this.performanceLevel===1?Math.min(base,.95):Math.min(base,.75);
    if(this.renderer){this.renderer.setPixelRatio(ratio);this.resize();}
    const effects=this.performanceLevel===0&&this.performanceMode!=='performance';
    if(this.atmosphere)this.atmosphere.visible=effects;
    this.rings?.forEach(ring=>ring.visible=effects);
    if(this.mapTexture&&this.textureVariants.size){
      const baseSize=mobile?512:1024,desired=this.performanceLevel>=2?Math.max(256,baseSize/2):baseSize;
      this.#setTextureResolution(desired);
    }
    this.onStatus?.(this.geographyWarning?'assetDegraded':this.performanceLevel===0?'ready':'degraded');
  }
  #updateSelectedLabel(){
    const label=this.pointLabel,record=this.selectedRecord,city=cities.find(item=>item.id===record?.cityId);
    if(!label||!this.active||!record||!city||this.performanceLevel>=2||(this.view==='world'&&this.camera.position.z>3)){if(label)label.hidden=true;return;}
    const T=this.THREE,lat=city.lat,lng=city.lng;this.earthGroup.updateMatrixWorld(true);this.camera.updateMatrixWorld();
    const worldPoint=spherePoint(T,lat,lng,1.045).applyMatrix4(this.earthGroup.matrixWorld);
    const normal=spherePoint(T,lat,lng,1).transformDirection(this.earthGroup.matrixWorld);
    const towardCamera=this.camera.position.clone().sub(worldPoint).normalize();
    if(normal.dot(towardCamera)<.05){label.hidden=true;return;}
    const projected=worldPoint.clone().project(this.camera);
    if(projected.z< -1||projected.z>1||Math.abs(projected.x)>.9||Math.abs(projected.y)>.9){label.hidden=true;return;}
    const stage=this.container.parentElement.getBoundingClientRect();
    label.textContent=`${city.names[this.labels?.lang]||city.names.en} · ${(this.labels?.typeName?.(record.type)||record.type)}`;
    label.dataset.type=record.type;label.style.left=`${(projected.x*.5+.5)*stage.width}px`;label.style.top=`${(-projected.y*.5+.5)*stage.height}px`;label.hidden=false;
  }
  #setTextureResolution(size){
    if(!this.mapTexture)return;let canvas=this.textureVariants.get(size);
    if(!canvas){canvas=document.createElement('canvas');canvas.width=size;canvas.height=size/2;canvas.getContext('2d',{alpha:false}).drawImage(this.textureVariants.values().next().value,0,0,size,size/2);this.textureVariants.set(size,canvas);}
    if(this.mapTexture.image!==canvas){this.mapTexture.image=canvas;this.mapTexture.needsUpdate=true;}
  }
  setPerformanceMode(mode='auto'){
    this.performanceMode=['auto','performance','quality'].includes(mode)?mode:'auto';
    this.lastFps=null;this.#setPerformanceLevel(this.performanceMode==='performance'?2:0);this.#start();
    const info=this.getPerformanceInfo();this.onPerformance?.(info);return info;
  }
  getPerformanceInfo(){return {mode:this.performanceMode,level:this.performanceLevel,fps:this.lastFps===null?null:Math.round(this.lastFps)};}
  resize(){
    if(!this.renderer||!this.camera||!this.container||this.contextLost)return;
    const width=this.container.clientWidth,height=this.container.clientHeight;if(width<2||height<2)return;
    this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();
  }
  zoomBy(amount){if(this.camera){this.camera.position.z=clamp(this.camera.position.z+amount,1.65,5.25);this.#start();}}
  setRotation(enabled){this.autoRotate=Boolean(enabled);this.onRotationChange?.(this.autoRotate);this.#start();return this.autoRotate;}
  #clearPointers(){this.pointerMap.clear();this.pinchDistance=0;this.dragOrigin=null;this.lastPointer=null;this.didMove=false;}
  #removePointer(pointerId){
    if(!this.pointerMap.delete(pointerId))return;
    this.pinchDistance=0;
    if(this.pointerMap.size===1){const point=this.pointerMap.values().next().value;this.dragOrigin={...point};this.lastPointer={...point};this.didMove=true;}
    else if(this.pointerMap.size===0)this.#clearPointers();
  }
  #bindPointerEvents(){
    const canvas=this.renderer.domElement;
    this.onPointerDown=event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      try{canvas.setPointerCapture?.(event.pointerId);}catch{}
      this.pointerMap.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(this.pointerMap.size===1){this.dragOrigin={x:event.clientX,y:event.clientY};this.lastPointer={x:event.clientX,y:event.clientY};this.didMove=false;}
      if(this.pointerMap.size===2){const points=[...this.pointerMap.values()];this.pinchDistance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);this.didMove=true;}
    };
    this.onPointerMove=event=>{
      if(!this.pointerMap.has(event.pointerId))return;
      this.pointerMap.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(this.pointerMap.size>=2){const points=[...this.pointerMap.values()],distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);if(this.pinchDistance)this.zoomBy((this.pinchDistance-distance)*.006);this.pinchDistance=distance;this.didMove=true;return;}
      if(!this.lastPointer||!this.dragOrigin)return;
      const dx=event.clientX-this.lastPointer.x,dy=event.clientY-this.lastPointer.y;this.lastPointer={x:event.clientX,y:event.clientY};
      if(Math.hypot(event.clientX-this.dragOrigin.x,event.clientY-this.dragOrigin.y)>4){this.didMove=true;this.earthGroup.rotation.y+=dx*.006;this.earthGroup.rotation.x=clamp(this.earthGroup.rotation.x+dy*.006,-1.35,1.35);if(this.autoRotate)this.setRotation(false);this.#start();}
    };
    this.onPointerUp=event=>{
      const isTap=this.pointerMap.size===1&&!this.didMove;this.#removePointer(event.pointerId);
      if(isTap)this.#selectAt(event.clientX,event.clientY);
    };
    this.onPointerCancel=event=>this.#removePointer(event.pointerId);
    this.onLostPointerCapture=event=>this.#removePointer(event.pointerId);
    this.onWheel=event=>{if(!this.active)return;event.preventDefault();this.zoomBy(event.deltaY*.0024);};
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
    this.onContextLost=event=>{
      event.preventDefault();this.contextLost=true;this.#stop();this.#clearPointers();
      clearTimeout(this.renderRetryTimer);this.renderRetryTimer=0;this.renderRecoveryAttempted=false;
      clearTimeout(this.contextRecoveryTimer);
      this.contextRecoveryTimer=setTimeout(()=>{if(this.contextLost&&this.active&&!this.disposed)this.#fail('context');},7000);
    };
    this.onContextRestored=()=>{
      try{
        clearTimeout(this.contextRecoveryTimer);this.contextRecoveryTimer=0;this.contextLost=false;this.fallbackSent=false;this.lowPerfWindows=0;this.fastPerfWindows=0;
        clearTimeout(this.renderRetryTimer);this.renderRetryTimer=0;this.renderRecoveryAttempted=false;this.sampleStart=performance.now();this.lastFrame=this.sampleStart;this.sampleFrames=0;this.lastFps=null;this.onPerformance?.(this.getPerformanceInfo());
        this.#setPerformanceLevel(this.performanceLevel);
        if(this.active)this.restoreFrameId=requestAnimationFrame(()=>{this.restoreFrameId=0;if(this.disposed||this.contextLost||!this.active)return;try{this.renderer.render(this.scene,this.camera);this.onStatus?.(this.performanceLevel?'degraded':'ready');this.#start();}catch(error){this.#fail('restore',error);}});
      }catch(error){this.#fail('restore',error);}
    };
    this.onWindowBlur=()=>this.#clearPointers();
    canvas.addEventListener('pointerdown',this.onPointerDown);canvas.addEventListener('pointermove',this.onPointerMove);canvas.addEventListener('pointerup',this.onPointerUp);canvas.addEventListener('pointercancel',this.onPointerCancel);canvas.addEventListener('lostpointercapture',this.onLostPointerCapture);
    canvas.addEventListener('wheel',this.onWheel,{passive:false});canvas.addEventListener('keydown',this.onKey);
    canvas.addEventListener('webglcontextlost',this.onContextLost);canvas.addEventListener('webglcontextrestored',this.onContextRestored);
    window.addEventListener('blur',this.onWindowBlur);
  }
  #fail(reason,error){
    if(reason==='render'&&!this.renderRecoveryAttempted&&this.active&&!this.contextLost&&!this.disposed){
      this.renderRecoveryAttempted=true;this.#stop();this.onStatus?.('degraded');
      this.renderRetryTimer=setTimeout(()=>{
        this.renderRetryTimer=0;
        if(this.disposed||!this.active||this.contextLost){this.renderRecoveryAttempted=false;return;}
        try{this.resize();this.renderer.render(this.scene,this.camera);this.renderRecoveryAttempted=false;this.fallbackSent=false;this.#start();}
        catch(retryError){this.renderRecoveryAttempted=false;this.#fail('renderFatal',retryError);}
      },180);
      return;
    }
    if(this.fallbackSent||this.disposed)return;this.fallbackSent=true;this.#stop();clearTimeout(this.contextRecoveryTimer);clearTimeout(this.renderRetryTimer);this.renderRetryTimer=0;
    if(error)console.warn(`Eagle Eye globe recovery failed (${reason}).`,error);
    this.onFallback?.(reason==='renderFatal'?'render':reason);
  }
  #selectAt(clientX,clientY){
    if(this.contextLost||!this.renderer?.domElement)return;
    const rect=this.renderer.domElement.getBoundingClientRect();if(!rect.width||!rect.height)return;
    this.pointer.set(((clientX-rect.left)/rect.width)*2-1,-((clientY-rect.top)/rect.height)*2+1);
    this.raycaster.setFromCamera(this.pointer,this.camera);
    const hits=this.raycaster.intersectObjects([this.earth,...this.markerGroup.children],true);
    const hit=hits[0]?.object?.userData?.recordId;if(hit)this.onSelect?.(hit,'globe');
  }
  dispose(){
    const failedMount=!this.mounted;this.disposed=true;this.#stop();clearTimeout(this.contextRecoveryTimer);clearTimeout(this.renderRetryTimer);this.renderRetryTimer=0;if(this.resizeFrameId)cancelAnimationFrame(this.resizeFrameId);if(this.restoreFrameId)cancelAnimationFrame(this.restoreFrameId);this.resizeFrameId=0;this.restoreFrameId=0;this.#clearPointers();
    document.removeEventListener('visibilitychange',this.visibilityHandler);window.removeEventListener('blur',this.onWindowBlur);this.resizeObserver?.disconnect();
    const canvas=this.renderer?.domElement;
    if(canvas){canvas.removeEventListener('pointerdown',this.onPointerDown);canvas.removeEventListener('pointermove',this.onPointerMove);canvas.removeEventListener('pointerup',this.onPointerUp);canvas.removeEventListener('pointercancel',this.onPointerCancel);canvas.removeEventListener('lostpointercapture',this.onLostPointerCapture);canvas.removeEventListener('wheel',this.onWheel);canvas.removeEventListener('keydown',this.onKey);canvas.removeEventListener('webglcontextlost',this.onContextLost);canvas.removeEventListener('webglcontextrestored',this.onContextRestored);}
    this.earthGeometry?.dispose();this.earthMaterial?.dispose();this.mapTexture?.dispose();this.markerGeometry?.dispose();this.haloGeometry?.dispose();this.markerMaterials?.forEach(material=>material.dispose());this.haloMaterials?.forEach(material=>material.dispose());
    this.gridLines?.forEach(line=>line.geometry.dispose());this.gridMaterial?.dispose();this.atmosphere?.geometry.dispose();this.atmosphere?.material.dispose();this.rings?.forEach(ring=>{ring.geometry.dispose();ring.material.dispose();});if(failedMount)this.renderer?.forceContextLoss?.();this.renderer?.dispose();canvas?.remove();
    this.textureVariants.clear();
  }
}
