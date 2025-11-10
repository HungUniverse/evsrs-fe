import { api } from "@/lib/axios/axios";
import type { MembershipLevel, MembershipConfigRequest } from "@/@types/membership";
import type { ItemBaseResponse } from "@/@types/response";
import type { ID } from "@/@types/common/pagination";

export const membershipConfigLevels = [
    "None", "Bronze", "Silver", "Gold"
] as const;

export type MembershipConfigLevel = typeof membershipConfigLevels[number];

export const MembershipConfigAPI = {
  getConfigs: async (): Promise<MembershipLevel[]> => {
    const response = await api.get<ItemBaseResponse<MembershipLevel[]>>("/api/MembershipConfig");
    return response.data.data;
  },
  createConfig: async (data: MembershipConfigRequest): Promise<MembershipLevel> => {
    const response = await api.post<ItemBaseResponse<MembershipLevel>>("/api/MembershipConfig", data);
    return response.data.data;
  },
  getConfigById: async (id: ID): Promise<MembershipLevel> => {
    const response = await api.get<ItemBaseResponse<MembershipLevel>>(`/api/MembershipConfig/${id}`);
    return response.data.data;
  },
  getConfigByLevel: async (level: MembershipConfigLevel): Promise<MembershipLevel> => {
    const response = await api.get<ItemBaseResponse<MembershipLevel>>(`/api/MembershipConfig/level/${level}`);
    return response.data.data;
  },
  updateConfig: async (id: ID, data: {discountPercent: number; requiredAmount: number;}): Promise<MembershipLevel> => {
    const response = await api.put<ItemBaseResponse<MembershipLevel>>(`/api/MembershipConfig/${id}`, data);
    return response.data.data;
  },
  deleteConfig: async (id: ID): Promise<void> => {
    await api.delete<ItemBaseResponse<void>>(`/api/MembershipConfig/${id}`);
  },
};