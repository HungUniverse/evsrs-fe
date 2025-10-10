import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { Amenity } from "@/@types/car/amentities";
import type { ItemBaseResponse } from "@/@types/response";

export const AmenityAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<PaginationResponse<Amenity>>("/api/Amenity", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Amenity> => {
    const res = await api.get<ItemBaseResponse<Amenity>>(`api/Amenities/${id}`);
    return res.data.data;
  },
};
