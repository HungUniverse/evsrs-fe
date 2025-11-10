export interface ForecastPeriod {
  startDate: string;
  endDate: string;
}

export interface ForecastRecommendation {
  stationId: string;
  stationName: string;
  vehicleType: string;
  vehicleTypeName: string;
  peakP90Demand: number;
  peakSlot: string | null;
  requiredUnits: number;
  currentAvailablePeak24h: number;
  gap: number;
  slaMet: boolean;
  priority: number;
  recommendedAction: string;
  reason: string | null;
}

export interface ForecastResponse {
  stationId: string;
  forecastPeriod: ForecastPeriod;
  horizonDays: number;
  recommendations: ForecastRecommendation[];
  generatedAt: string;
}