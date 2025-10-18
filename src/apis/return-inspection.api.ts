import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type {
  ReturnInspection,
  ReturnInspectionRequest,
  ReturnInspectionResponse,
} from "@/@types/order/return-inspection";

export const returnInspectionAPI = {
  create: async (data: ReturnInspectionRequest): Promise<ReturnInspection> => {
    const res = await api.post<ItemBaseResponse<ReturnInspection>>(
      "/api/Return/inspection",
      data
    );
    return res.data.data;
  },

  getByOrderId: async (
    orderId: string
  ): Promise<ReturnInspectionRequest | null> => {
    const res = await api.get<ItemBaseResponse<ReturnInspectionResponse>>(
      `/api/Return/inspection/order/${orderId}`
    );
    return res.data.data;
  },
};
