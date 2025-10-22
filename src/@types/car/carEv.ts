import type { ID, DateString } from "@/@types/common/pagination";
import type { CarEvStatus } from "../enum";
import type { Model } from "./model";
import type { Depot } from "./depot";

export interface CarEV {
  id: ID;
  modelId: ID;
  licensePlate: string;
  model: Model;
  depotId: ID;
  depot: Depot;
  batteryHealthPercentage: number;
  status: CarEvStatus; // có thể đổi sang enum
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
}
export interface CarEVRequest {
  modelId: ID;
  depotId: ID;
  licensePlate: string;
  batteryHealthPercentage: string;
  status: CarEvStatus;
}
