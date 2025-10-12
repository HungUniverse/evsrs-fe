import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { Model } from "@/@types/car/model";
import type { ItemBaseResponse } from "@/@types/response";

export const modelAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<PaginationResponse<Model>>("/api/Model", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Model> => {
    const res = await api.get<ItemBaseResponse<Model>>(`/api/Model/${id}`);
    return res.data.data;
  },
};
