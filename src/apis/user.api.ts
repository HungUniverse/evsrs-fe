import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { ItemBaseResponse } from "@/@types/response";
import type { UserFull } from "@/@types/auth.type";

export const UserFullAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<UserFull>>("/api/User", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<UserFull> => {
    const res = await api.get<ItemBaseResponse<UserFull>>(`/api/User/${id}`);
    return res.data.data;
  },
  getDepotByUserId: async (id: string) => {
    const res = await api.get<ItemBaseResponse<UserResponse>>(
      `/api/User/${id}`
    );
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
    await api.patch(`/api/User/staff/${id}`, { depotId });
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/User/${id}`);
  },
};
