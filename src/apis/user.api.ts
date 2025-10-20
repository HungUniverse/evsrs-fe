import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";
import type { UserFull, StaffRequest } from "@/@types/auth.type";

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
    const res = await api.post<ItemBaseResponse<UserFull>>("/api/User/staff", data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/User/${id}`);
  },
};
