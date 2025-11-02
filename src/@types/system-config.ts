import type { SystemConfigType } from "./enum";
export interface SystemConfigTypeResponse {
  id: string;
  key: string;
  value: string;
  configType: SystemConfigType;
  createAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}
