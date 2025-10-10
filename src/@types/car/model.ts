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
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
}
