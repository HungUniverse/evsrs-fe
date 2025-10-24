import type { ID, DateString } from "@/@types/common/pagination";

export interface Depot {
  id: ID;
  name: string;
  mapId: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
}
export interface DepotRequest {
  name: string;
  mapId: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  lattitude: string;
  longitude: string;
  openTime: string;
  closeTime: string;
}