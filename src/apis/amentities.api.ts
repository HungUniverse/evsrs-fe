import { api } from "@/lib/axios/axios";
import type { Amenity } from "@/@types/car/amentities";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";

export const AmenityAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<Amenity>>("/api/Amenities", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Amenity> => {
    const res = await api.get<ItemBaseResponse<Amenity>>(`api/Amenities/${id}`);
    return res.data.data;
  },
};
