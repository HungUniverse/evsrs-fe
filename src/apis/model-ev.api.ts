import { api } from "@/lib/axios/axios";
import type { Model, ModelRequest } from "@/@types/car/model";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";

export const modelAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<Model>>("/api/Model", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Model> => {
    const res = await api.get<ItemBaseResponse<Model>>(`/api/Model/${id}`);
    return res.data.data;
  },
  create: async (data: ModelRequest): Promise<Model> => {
    const res = await api.post<ItemBaseResponse<Model>>("/api/Model", data);
    return res.data.data;
  },
  update: async (id: string, data: ModelRequest): Promise<Model> => {
    const res = await api.put<ItemBaseResponse<Model>>(
      `/api/Model/${id}`,
      data
    );
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/Model/${id}`);
  },
};
