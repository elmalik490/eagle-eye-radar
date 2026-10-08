import { cities, sectors } from './demo-data.js';
export const weights = { demand: .25, revenue: .30, evidence: .25, urgency: .20 };
export function scenarioFor(record) {
  const city = cities.find(item => item.id === record.cityId);
  const sector = sectors[record.sector];
  const low = Math.round(sector.leads[0] * sector.ticket[0] * sector.recovery[0] * city.multiplier);
  const high = Math.round(sector.leads[1] * sector.ticket[1] * sector.recovery[1] * city.multiplier);
  const revenue = Math.min(100, Math.round((sector.ticket[0] / 16) + sector.recovery[0] * 100));
  const demand = Math.min(100, Math.round(record.demandFactor * 70));
  const evidence = record.evidenceStrength;
  const urgency = record.urgency;
  const score = Math.round(demand * weights.demand + revenue * weights.revenue + evidence * weights.evidence + urgency * weights.urgency);
  return { city, sector, low, high, dimensions: { demand, revenue, evidence, urgency }, score, weights };
}
export const money = value => '$' + Math.round(value).toLocaleString('en-US');
