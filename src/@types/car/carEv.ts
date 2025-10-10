// src/@types/vehicle/car-ev.ts
import type { ID, DateString } from "@/@types/common/pagination";

export interface CarEV {
  id: ID;
  modelId: ID;
  depotId: ID;
  odoMeter: number;
  batteryHealthPercentage: number;
  status: string; // có thể đổi sang enum
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
}
