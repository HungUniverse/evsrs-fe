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
}
