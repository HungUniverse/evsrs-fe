import type { ID, DateString } from "@/@types/common/pagination";
import type { CarEvStatus } from "../enum";

export interface CarEV {
  id: ID;
  modelId: ID;
  model?: {
    id?: ID;
    modelName?: string;
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
