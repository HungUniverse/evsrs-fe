import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type {
  CreateHandoverContractRequest,
  HandoverContract,
} from "@/@types/order/handover-contract";
import type { SignStatus } from "@/@types/enum";

export const handoverContractAPI = {
  create: async (
    data: CreateHandoverContractRequest
  ): Promise<HandoverContract> => {
    const res = await api.post<ItemBaseResponse<HandoverContract>>(
      "/api/Handover/contract",
      data
    );
    return res.data.data;
  },

  getById: async (id: string): Promise<HandoverContract> => {
    const res = await api.get<ItemBaseResponse<HandoverContract>>(
      `/api/Handover/contract/${id}`
    );
    return res.data.data;
  },

  getByOrderBookingId: async (
    orderBookingId: string
  ): Promise<HandoverContract | null> => {
    try {
      const res = await api.get<ItemBaseResponse<HandoverContract>>(
        `/api/Handover/contract/order/${orderBookingId}`
      );
      return res.data.data;
    } catch {
      return null;
    }
  },

  updateFileUrl: async (
    id: string,
    fileUrl: string
  ): Promise<HandoverContract> => {
    const res = await api.patch<ItemBaseResponse<HandoverContract>>(
      `/api/Handover/contract/${id}`,
      { fileUrl }
    );
    return res.data.data;
  },

  updateSignStatus: async (
    id: string,
    signStatus: SignStatus
  ): Promise<HandoverContract> => {
    const res = await api.patch<ItemBaseResponse<HandoverContract>>(
      `/api/Handover/contract/${id}`,
      { signStatus }
    );
    return res.data.data;
  },
};
