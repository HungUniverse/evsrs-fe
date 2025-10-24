import { api } from "@/lib/axios/axios";
import type { CarManufacture, CarManufactureRequest } from "@/@types/car/carManufacture";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";

export const CarManufactureAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ListBaseResponse<CarManufacture>>(
      "/api/CarManufacture",
      { params: { pageNumber, pageSize } }
    ),
  getById: async (id: string): Promise<CarManufacture> => {
    const res = await api.get<ItemBaseResponse<CarManufacture>>(
      `api/CarManufacture/${id}`
    );
    return res.data.data;
  },
  create: async (data: CarManufactureRequest): Promise<CarManufacture> => {
    const res = await api.post<ItemBaseResponse<CarManufacture>>(
      `api/CarManufacture`,
      data
    );
    return res.data.data;
  },
  update: async (id: string, data: CarManufactureRequest): Promise<CarManufacture> => {
    const res = await api.put<ItemBaseResponse<CarManufacture>>(
      `api/CarManufacture/${id}`,
      data
    );
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`api/CarManufacture/${id}`);
  },
};
