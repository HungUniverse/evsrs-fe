import type { ID, DateString } from "@/@types/common/pagination";

export interface Model {
  id: ID;
  manufacturerCarId: ID;
  amenitiesId: ID;
  modelName: string;
  batteryCapacityKwh: string;
  rangeKm: string;
  limiteDailyKm: number;
  seats: number;
  price: number;
  sale: number;
  image: string;
  electricityFee: number;
  overageFee: number;
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
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
};
