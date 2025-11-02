import type { ItemBaseResponse } from "@/@types/response";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import { api } from "@/lib/axios/axios";

export const SystemConfig = {
  getByKey: async (key: string): Promise<SystemConfigTypeResponse> => {
    const res = await api.post<ItemBaseResponse<SystemConfigTypeResponse>>(
      `/api/SystemConfig/key/${key}`
    );
    return res.data.data;
  },
};
