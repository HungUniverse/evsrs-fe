import type { ID, DateString } from "@/@types/common/pagination";

export interface Amenity {
  id: ID;
  name: string;
  icon: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
}
export interface AmenityRequest {
  name: string;
  icon: string;
}