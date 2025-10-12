import { api } from "@/lib/axios/axios";
import type { PaginationResponse } from "@/@types/common/pagination";
import type { CarManufacture } from "@/@types/car/carManufacture";
import type { ItemBaseResponse } from "@/@types/response";

export type CreateCarManufactureRequest = {
  name: string;
  logo: string;
};

export const CarManufactureAPI = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    api.get<ItemBaseResponse<PaginationResponse<CarManufacture>>>(
      "/api/CarManufacture",
      {
        params: { pageNumber, pageSize },
      }
    ),
  getById: async (id: string): Promise<CarManufacture> => {
    const res = await api.get<ItemBaseResponse<CarManufacture>>(
      `api/CarManufacture/${id}`
    );
    return res.data.data;
  },
  addNew: async (data: CreateCarManufactureRequest): Promise<CarManufacture> => {
    const res = await api.post<ItemBaseResponse<CarManufacture>>(
      `api/CarManufacture`,
      data
    );
    return res.data.data;
  },
};
