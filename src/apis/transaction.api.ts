import type { ItemBaseResponse, ListBaseResponse } from "@/@types/response";
import type { TransactionResponse } from "@/@types/payment/transaction";
import { api } from "@/lib/axios/axios";

export type TransactionQueryParams = {
  page?: number;
  pageSize?: number;
};

export const TransactionApi = {
  // GET /api/Transaction - Lấy danh sách tất cả transactions với pagination
  getAll: async (params?: TransactionQueryParams): Promise<ListBaseResponse<TransactionResponse>> => {
    const res = await api.get<ListBaseResponse<TransactionResponse>>(
      `/api/Transaction`,
      {
        params: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 10,
        },
      }
    );
    return res.data;
  },

  // POST /api/Transaction - Tạo transaction mới
  create: async (data: Partial<TransactionResponse>): Promise<TransactionResponse> => {
    const res = await api.post<ItemBaseResponse<TransactionResponse>>(
      `/api/Transaction`,
      data
    );
    return res.data.data;
  },

  // GET /api/Transaction/{id} - Lấy transaction theo id
  getById: async (id: string): Promise<TransactionResponse> => {
    const res = await api.get<ItemBaseResponse<TransactionResponse>>(
      `/api/Transaction/${id}`
    );
    return res.data.data;
  },

  // PUT /api/Transaction/{id} - Cập nhật transaction
  update: async (id: string, data: Partial<TransactionResponse>): Promise<TransactionResponse> => {
    const res = await api.put<ItemBaseResponse<TransactionResponse>>(
      `/api/Transaction/${id}`,
      data
    );
    return res.data.data;
  },

  // DELETE /api/Transaction/{id} - Xóa transaction
  delete: async (id: string): Promise<void> => {
    await api.delete<ItemBaseResponse<void>>(`/api/Transaction/${id}`);
  },

  // GET /api/Transaction/order/{orderId} - Lấy transactions theo orderId
  getByOrderId: async (orderId: string): Promise<TransactionResponse[]> => {
    const res = await api.get<ItemBaseResponse<TransactionResponse[]>>(
      `/api/Transaction/order/${orderId}`
    );
    return res.data.data;
  },

  // GET /api/Transaction/user/{userId} - Lấy transactions theo userId
  getTransactionsByUserId: async (userId: string): Promise<TransactionResponse[]> => {
    const res = await api.get<ItemBaseResponse<TransactionResponse[]>>(
      `/api/Transaction/user/${userId}`
    );
    return res.data.data;
  },
};
