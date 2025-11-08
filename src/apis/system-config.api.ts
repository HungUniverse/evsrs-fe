import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import type { SystemConfigType } from "@/@types/enum";
import { api } from "@/lib/axios/axios";

export const SystemConfig = {
  getById: async (id: string): Promise<SystemConfigTypeResponse> => {
    const res = await api.get<ItemBaseResponse<SystemConfigTypeResponse>>(
      `/api/SystemConfig/${id}`
    );
    return res.data.data;
  },
  getAll: async (): Promise<ListBaseResponse<SystemConfigTypeResponse>> => {
    const res = await api.get<ListBaseResponse<SystemConfigTypeResponse>>(
      `/api/SystemConfig`
    );
    return res.data;
  },
  createConfig: async (data: { key: string, value: string, configType: SystemConfigType }): Promise<SystemConfigTypeResponse> => {
    const res = await api.post<ItemBaseResponse<SystemConfigTypeResponse>>(
      `/api/SystemConfig`,
      data
    );
    return res.data.data;
  },
  deleteConfig: async (id: string): Promise<void> => {
    await api.delete<ItemBaseResponse<void>>(`/api/SystemConfig/${id}`);
  },
  updateConfig: async (id: string, data: { key: string, value: string, configType: SystemConfigType }): Promise<SystemConfigTypeResponse> => {
    const res = await api.put<ItemBaseResponse<SystemConfigTypeResponse>>(
      `/api/SystemConfig/${id}`,
      data
    );
    return res.data.data;
  },
  getByKey: async (key: string): Promise<SystemConfigTypeResponse> => {
    const res = await api.get<ItemBaseResponse<SystemConfigTypeResponse>>(
      `/api/SystemConfig/key/${key}`
    );
    return res.data.data;
  },
  getByConfigType: async (configType: SystemConfigType): Promise<SystemConfigTypeResponse[]> => {
    const res = await api.get<ItemBaseResponse<SystemConfigTypeResponse[]>>(
      `/api/SystemConfig/type/${configType}`
    );
    return res.data.data;
  },
};
