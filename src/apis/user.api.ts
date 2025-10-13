import { api } from "@/lib/axios/axios";
import type { ListBaseResponse } from "@/@types/response";
import type { User } from "@/@types/customer";

export const userAPI = {
  getUsers: (page: number = 1, pageSize: number = 10) =>
    api.get<ListBaseResponse<User>>("/api/User", {
      params: { page, pageSize },
    }),

  getUserById: async (id: string): Promise<User> => {
    const res = await api.get<{ data: User }>(`/api/User/${id}`);
    return res.data.data;
  },
};
