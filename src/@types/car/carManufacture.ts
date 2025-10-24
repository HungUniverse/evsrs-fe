import type { ID, DateString } from "@/@types/common/pagination";

export interface CarManufacture {
  id: ID;
  name: string;
  logo: string;
  createdBy: string;
  updatedBy: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  isDeleted: boolean;
  [key: string]: unknown; // Add index signature to satisfy BaseRecord constraint
}

export type CarManufactureRequest = {
  name: string;
  logo: string;
};