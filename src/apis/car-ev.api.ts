import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type { CarEV, CarEVRequest } from "@/@types/car/carEv";
import type { PaginationResponse } from "@/@types/common/pagination";

export type CarEVListParams = {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  depotId?: string;
  modelId?: string;
};

export const carEVAPI = {
  getAll: (params: CarEVListParams = { pageNumber: 1, pageSize: 10 }) =>
    api.get<PaginationResponse<CarEV>>("/api/CarEV", { params }),
  getById: async (id: string): Promise<CarEV> => {
    const res = await api.get<ItemBaseResponse<CarEV>>(`/api/CarEV/${id}`);
    return res.data.data;
  },
  getByDepotId: async (depotId: string): Promise<CarEV[]> => {
    const res = await api.get<ItemBaseResponse<CarEV[]>>(
      `/api/CarEV/depot/${depotId}`
    );
    return res.data.data;
  },
  create: async (data: CarEVRequest): Promise<CarEV> => {
    const res = await api.post<ItemBaseResponse<CarEV>>("/api/CarEV", data);
    return res.data.data;
  },
  update: async (id: string, data: CarEVRequest): Promise<CarEV> => {
    const res = await api.put<ItemBaseResponse<CarEV>>(
      `/api/CarEV/${id}`,
      data
    );
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete<ItemBaseResponse<CarEV>>(`/api/CarEV/${id}`);
  },
  getCarByDepotId: async (depotId: string) => {
    const res = await api.get<ItemBaseResponse<PaginationResponse<CarEV>>>(
      `/api/CarEV/depot/${depotId}/paginated`
    );
    return res.data.data;
  },
};
