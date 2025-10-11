import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { Depot } from "@/@types/car/depot";
import type { ItemBaseResponse } from "@/@types/response";

export const depotAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<PaginationResponse<Depot>>("/api/Depot", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Depot> => {
    const res = await api.get<ItemBaseResponse<Depot>>(`api/Depot/${id}`);
    return res.data.data;
  },
};
