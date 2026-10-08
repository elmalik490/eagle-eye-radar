import { cities, sectors } from './demo-data.js';

// All inputs are fixed synthetic fixture dimensions. They are not confidence, evidence, prediction, or a claim about local prices.
export const weights={demand:.45,urgency:.30,scope:.25};
export function scenarioFor(record){
  const city=cities.find(item=>item.id===record.cityId);
  const sector=sectors[record.sector];
  const low=Math.round(sector.prospects[0]*sector.ticket[0]*sector.recoverable[0]);
  const high=Math.round(sector.prospects[1]*sector.ticket[1]*sector.recoverable[1]);
  const dimensions={demand:record.demandIndex,urgency:record.urgency,scope:record.scopeIndex};
  const score=Math.round(dimensions.demand*weights.demand+dimensions.urgency*weights.urgency+dimensions.scope*weights.scope);
  const priorityBand=score>=72?'high':score>=58?'medium':'low';
  return {city,sector,low,high,dimensions,score,priorityBand,weights,assumptions:{prospects:sector.prospects,ticket:sector.ticket,recoverable:sector.recoverable,currency:'USD',period:'month'}};
}
export const money=(value,language='en')=>new Intl.NumberFormat(language,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
