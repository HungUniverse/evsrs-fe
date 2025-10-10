import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { CarEV } from "@/@types/car/carEv";
import type { ItemBaseResponse } from "@/@types/response";

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
    const res = await api.get<ItemBaseResponse<CarEV>>(`api/CarEV/${id}`);
    return res.data.data;
  },
};
