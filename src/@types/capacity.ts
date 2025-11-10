export interface CapacityAction {
  stationId: string;
  vehicleType: string;
  actionType: string;
  units: number;
  priority: number;
  rationale: string;
  estimatedCost: number | null;
  relatedStationId: string | null;
}

export interface CapacitySummary {
  totalCost: number;
  stationsAffected: number;
  unitsAdded: number;
  unitsReallocated: number;
  budgetRemaining: number | null;
  notes: string;
}

export interface CapacityAdviceResponse {
  actions: CapacityAction[];
  summary: CapacitySummary;
}