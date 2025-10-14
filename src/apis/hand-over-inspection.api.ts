import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type {
  HandoverInspection,
  HandoverInspectionRequest,
} from "@/@types/order/inspection";

export const handoverInspectionAPI = {
  create: async (
    data: HandoverInspectionRequest
  ): Promise<HandoverInspection> => {
    const res = await api.post<ItemBaseResponse<HandoverInspection>>(
      "/api/Handover/inspection",
      data
    );
    return res.data.data;
  },

  getByOrderId: async (orderId: string): Promise<HandoverInspection | null> => {
    try {
      const res = await api.get<ItemBaseResponse<HandoverInspection[]>>(
        `/api/Handover/inspection/order/${orderId}`
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
