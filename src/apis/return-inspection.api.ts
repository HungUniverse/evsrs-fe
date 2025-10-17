import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type {
  ReturnInspection,
  ReturnInspectionRequest,
} from "@/@types/order/return-inspection";

export const returnInspectionAPI = {
  create: async (data: ReturnInspectionRequest): Promise<ReturnInspection> => {
    const res = await api.post<ItemBaseResponse<ReturnInspection>>(
      "/api/Return/inspection",
      data
    );
    return res.data.data;
  },

  getByOrderId: async (orderId: string): Promise<ReturnInspection | null> => {
    try {
      const res = await api.get<ItemBaseResponse<ReturnInspection[]>>(
        `/api/Return/inspection/order/${orderId}`
      );
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      if (list.length === 0) return null;
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return list[0];
    } catch {
      return null;
    }
  },
};
