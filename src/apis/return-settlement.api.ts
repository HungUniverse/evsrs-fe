import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type {
  ReturnSettlement,
  ReturnSettlementRequest,
} from "@/@types/order/return-settlement";

export const returnSettlementAPI = {
  create: async (body: ReturnSettlementRequest): Promise<ReturnSettlement> => {
    const res = await api.post<ItemBaseResponse<ReturnSettlement>>(
      "/api/Return/settlement",
      body
    );
    return res.data.data;
  },

  getByOrderId: async (orderId: string): Promise<ReturnSettlement> => {
    const res = await api.get<ItemBaseResponse<ReturnSettlement>>(
      `/api/Return/settlement/order/${orderId}`
    );
    return res.data.data;
  },
};
