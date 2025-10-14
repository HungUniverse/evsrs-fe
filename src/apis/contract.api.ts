import type { Contract } from "@/@types/order/contract";
import type { ItemBaseResponse } from "@/@types/response";
import { api } from "@/lib/axios/axios";

export const contractAPI = {
  getByOrderId: async (orderId: string): Promise<Contract | null> => {
    const res = await api.get<ItemBaseResponse<Contract>>(
      `/api/Handover/contract/order/${orderId}`
    );
    return res.data.data;
  },
};
