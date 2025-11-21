import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";
import type { FeedBack, FeedbackRequest } from "@/@types/order/feedback";

export const feedbackAPI = {
  create: async (body: FeedbackRequest): Promise<FeedBack> => {
    const res = await api.post<ItemBaseResponse<FeedBack>>(
      "/api/Feedback",
      body
    );
    return res.data.data;
  },

  getById: async (id: string): Promise<FeedBack> => {
    const res = await api.get<ItemBaseResponse<FeedBack>>(
      `/api/Feedback/${id}`
    );
    return res.data.data;
  },

  getByOrderId: async (orderBookingId: string): Promise<FeedBack> => {
    const res = await api.get<ItemBaseResponse<FeedBack>>(
      `/api/Feedback/order/${orderBookingId}`
    );
    return res.data.data;
  },

  getAll: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ListBaseResponse<FeedBack>> => {
    const res = await api.get<ListBaseResponse<FeedBack>>("/api/Feedback", {
      params: { pageNumber, pageSize },
    });
    return res.data;
  },
};
