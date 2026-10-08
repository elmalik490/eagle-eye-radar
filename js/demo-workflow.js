export const workflowStages=['detected','review','verification','qualified','actionReady','resolved'];
const STORAGE_KEY='eagle-eye-demo-workflow-v1';
const clone=value=>JSON.parse(JSON.stringify(value));

export class DemoWorkflow {
  constructor(recordIds,sessionStartedAt,storage=globalThis.sessionStorage) {
    this.storage=storage;
    try { this.state=JSON.parse(this.storage?.getItem(STORAGE_KEY)||'{}')||{}; } catch { this.state={}; }
    for(const id of recordIds){
      if(!this.state[id])this.state[id]={stage:'detected',events:[{kind:'generated',at:sessionStartedAt}]};
    }
    this.#save();
  }
  #save(){try{this.storage?.setItem(STORAGE_KEY,JSON.stringify(this.state));}catch{/* Session storage is optional; memory state remains usable. */}}
  getStage(id){return workflowStages.includes(this.state[id]?.stage)?this.state[id].stage:'detected';}
  getEvents(id){return clone(this.state[id]?.events||[]);}
  getSummary(){const summary=Object.fromEntries(workflowStages.map(stage=>[stage,0]));Object.values(this.state).forEach(item=>{const stage=workflowStages.includes(item.stage)?item.stage:'detected';summary[stage]++;});return summary;}
  addEvent(id,kind){if(!this.state[id])return;this.state[id].events.push({kind,at:new Date().toISOString()});this.#trim(id);this.#save();}
  advance(id){
    if(!this.state[id])return null;
    const index=workflowStages.indexOf(this.getStage(id));if(index<0||index>=workflowStages.length-1)return null;
    this.state[id].stage=workflowStages[index+1];this.state[id].events.push({kind:'stage',stage:this.state[id].stage,at:new Date().toISOString()});this.#trim(id);this.#save();return this.state[id].stage;
  }
  reset(id){if(!this.state[id])return;this.state[id].stage='detected';this.state[id].events.push({kind:'reset',stage:'detected',at:new Date().toISOString()});this.#trim(id);this.#save();}
  #trim(id){this.state[id].events=this.state[id].events.slice(-100);}
}
