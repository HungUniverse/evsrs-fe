import { api } from "@/lib/axios/axios";
import type { Amenity, AmenityRequest } from "@/@types/car/amentities";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";

export const AmenityAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<Amenity>>("/api/Amenities", {
      params: { pageNumber, pageSize },
    }),
  getById: async (id: string): Promise<Amenity> => {
    const res = await api.get<ItemBaseResponse<Amenity>>(
      `/api/Amenities/${id}`
    );
    return res.data.data;
  },
  create: async (amenity: AmenityRequest) => {
    const res = await api.post<ItemBaseResponse<Amenity>>(
      "/api/Amenities",
      amenity
    );
    return res.data.data;
  },
  update: async (id: string, amenity: AmenityRequest) => {
    const res = await api.put<ItemBaseResponse<Amenity>>(
      `/api/Amenities/${id}`,
      amenity
    );
    return res.data.data;
  },
  delete: async (id: string) => {
    const res = await api.delete<ItemBaseResponse<Amenity>>(
      `/api/Amenities/${id}`
    );
    return res.data.data;
  },
};
