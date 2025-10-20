import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { ItemBaseResponse } from "@/@types/response";
import type { UserFull, UserResponse } from "@/@types/auth.type";

export const UserFullAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<PaginationResponse<UserFull>>("/api/User", {
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
};
