import { api } from "@/lib/axios/axios";
import type { Depot, DepotRequest } from "@/@types/car/depot";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";

export const depotAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<Depot>>("/api/Depot", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Depot> => {
    const res = await api.get<ItemBaseResponse<Depot>>(`api/Depot/${id}`);
    return res.data.data;
  },
  create: async (data: DepotRequest): Promise<Depot> => {
    const res = await api.post<ItemBaseResponse<Depot>>("/api/Depot", data);
    return res.data.data;
  },
  update: async (id: string, data: DepotRequest): Promise<Depot> => {
    const res = await api.put<ItemBaseResponse<Depot>>(`api/Depot/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`api/Depot/${id}`);
  },
};
