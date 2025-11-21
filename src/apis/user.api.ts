import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";
import type { UserFull, StaffRequest, UserResponse } from "@/@types/auth.type";

export const UserFullAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<UserFull>>("/api/User", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<UserFull> => {
    const res = await api.get<ItemBaseResponse<UserFull>>(`/api/User/${id}`);
    return res.data.data;
  },
  //Tạo mới staff
  createStaff: async (data: StaffRequest): Promise<UserFull> => {
    const res = await api.post<ItemBaseResponse<UserFull>>(
      "/api/User/staff",
      data
    );
    return res.data.data;
  },
  updateDepot: async (id: string, depotId: string): Promise<void> => {
    await api.put(`/api/User/${id}/depot`, depotId);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/User/${id}`);
  },
  getDepotByUserId: async (id: string) => {
    const res = await api.get<ItemBaseResponse<UserResponse>>(
      `/api/User/${id}`
    );
    return res.data.data;
  },
  updateProfilePicture: async (id: string, profilePicture: string): Promise<ItemBaseResponse<string>> => {
    const response = await api.patch<ItemBaseResponse<string>>(`/api/User/${id}/profile-picture`, {
      profilePicture,
    });
    return response.data;
  }
};
