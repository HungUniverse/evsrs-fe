import type { ID, DateString } from "@/@types/common/pagination";
import type { CarEvStatus } from "../enum";

export interface CarEV {
  id: ID;
  modelId: ID;
  licensePlate: string;
  model?: {
    id?: ID;
    modelName?: string;
    limiteDailyKm?: number;
  };
  depotId: ID;
  batteryHealthPercentage: number;
  status: CarEvStatus; // có thể đổi sang enum
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
}
