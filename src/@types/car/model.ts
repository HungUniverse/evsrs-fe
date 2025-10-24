import type { ID, DateString } from "@/@types/common/pagination";

export interface Model {
  id: ID;
  modelName: string;
  manufacturerCarId: ID;
  amenitiesId: ID;
  batteryCapacityKwh: string;
  rangeKm: string;
  limiteDailyKm: string;
  seats: string;
  price: number;
  sale: number;
  image: string;
  electricityFee: string;
  overageFee: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
  [key: string]: unknown; // Add index signature to satisfy BaseRecord constraint
}

export type ModelRequest = {
  modelName: string;
  manufacturerCarId: string;
  amenitiesId: string;
  limiteDailyKm: string;
  rangeKm: string;
  seats: string;
  price: number;
  sale: number;
  batteryCapacityKwh: string;
  image: string;
  isDeleted: false;
}