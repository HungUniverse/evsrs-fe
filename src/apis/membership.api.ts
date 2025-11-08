import { api } from "@/lib/axios/axios";
import type { MembershipLevel, MyMembershipResponse } from "@/@types/membership";
import type { ItemBaseResponse } from "@/@types/response";
import type { ID } from "@/@types/common/pagination";

export const MembershipAPI = {
  getLevels: async (): Promise<MembershipLevel[]> => {
    const response = await api.get<ItemBaseResponse<MembershipLevel[]>>("/api/Membership/levels");
    return response.data.data;
  },
  getLevelById: async (id: ID): Promise<MembershipLevel> => {
    const response = await api.get<ItemBaseResponse<MembershipLevel>>(`/api/Membership/levels/${id}`);
    return response.data.data;
  },
  getByUserId: async (userId: ID): Promise<MyMembershipResponse> => {
    const response = await api.get<ItemBaseResponse<MyMembershipResponse>>(`/api/Membership/user/${userId}`);
    return response.data.data;
  },
  getMyMembership: async (): Promise<MyMembershipResponse> => {
    const response = await api.get<ItemBaseResponse<MyMembershipResponse>>(`/api/Membership/my-membership`);
    return response.data.data;
  },
  updateLevel: async (id: ID, data: {discountPercent: number; requiredAmount: number;}): Promise<MembershipLevel> => {
    const response = await api.put<ItemBaseResponse<MembershipLevel>>(`/api/Membership/levels/${id}`, data);
    return response.data.data;
  },
};