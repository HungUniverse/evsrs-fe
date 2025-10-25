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
