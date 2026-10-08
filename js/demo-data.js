// Synthetic-only fixtures. City coordinates are city-level map anchors, never business locations.
export const cities = [
  { id: 'phoenix', name: 'Phoenix, AZ', nameKey: 'cityPhoenix', country: 'United States', lat: 33.4484, lng: -112.074, multiplier: 1.08 },
  { id: 'miami', name: 'Miami, FL', nameKey: 'cityMiami', country: 'United States', lat: 25.7617, lng: -80.1918, multiplier: 1.12 },
  { id: 'houston', name: 'Houston, TX', nameKey: 'cityHouston', country: 'United States', lat: 29.7604, lng: -95.3698, multiplier: 1.00 }
];
export const sectors = {
  hvac: { label: 'HVAC & Climate Control', ticket: [350, 550], leads: [20, 36], recovery: [.08, .16], signal: 'signalHvac', action: 'actionHvac' },
  plumbing: { label: 'Plumbing & Emergency Services', ticket: [280, 480], leads: [24, 42], recovery: [.07, .14], signal: 'signalPlumbing', action: 'actionPlumbing' },
  roofing: { label: 'Roofing Repair', ticket: [900, 1600], leads: [10, 22], recovery: [.05, .12], signal: 'signalRoofing', action: 'actionRoofing' }
};
export const types = ['missedCalls', 'unansweredLeads', 'serviceDemand'];
export const demoRecords = cities.flatMap((city, cityIndex) => Object.entries(sectors).map(([sector, profile], sectorIndex) => ({
  id: `${city.id}-${sector}`, cityId: city.id, sector, type: types[(cityIndex + sectorIndex) % types.length],
  // Deterministic illustrative factors; no real business or observed signal is represented.
  demandFactor: [1, 0.92, 1.1][(cityIndex + sectorIndex) % 3], urgency: [82, 68, 75][(cityIndex * 2 + sectorIndex) % 3],
  evidenceStrength: [30, 34, 38][(cityIndex + sectorIndex * 2) % 3], priorityBand: ['high', 'medium', 'low'][(cityIndex + sectorIndex) % 3],
  sectorIndex, signalKey: profile.signal, actionKey: profile.action
})));
export const verificationStatus = 'unverified';
