import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { ItemBaseResponse } from "@/@types/response";
import type { UserFull } from "@/@types/auth.type";

export const UserFullAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<PaginationResponse<UserFull>>("/api/User", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<UserFull> => {
    const res = await api.get<ItemBaseResponse<UserFull>>(`/api/User/${id}`);
    return res.data.data;
  },
  addNew: async (user: UserFull): Promise<UserFull> => {
    const res = await api.post<ItemBaseResponse<UserFull>>("/api/User/staff", user);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/User/${id}`);
  },
};
