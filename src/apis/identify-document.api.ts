import type { ItemBaseResponse } from "@/@types/response";
import { api } from "@/lib/axios/axios";
import type { IdentifyDocumentRequest, IdentifyDocumentResponse } from "@/@types/identify-document";

export const identifyDocumentAPI = {
  // Upload giấy tờ định danh
  upload: async (
    data: IdentifyDocumentRequest
  ): Promise<ItemBaseResponse<IdentifyDocumentResponse>> => {
    const response = await api.post<ItemBaseResponse<IdentifyDocumentResponse>>(
      "/api/IdentifyDocument",
      data
    );
    return response.data;
  },

  getUserDocuments: async (
    userId: string
  ): Promise<ItemBaseResponse<IdentifyDocumentResponse>> => {
    const response = await api.get<ItemBaseResponse<IdentifyDocumentResponse>>(
      `/api/IdentifyDocument/user/${userId}`
    );
    return response.data;
  },

  getById: async (
    id: string
  ): Promise<ItemBaseResponse<IdentifyDocumentResponse>> => {
    const response = await api.get<ItemBaseResponse<IdentifyDocumentResponse>>(
      `/api/IdentifyDocument/${id}`
    );
    return response.data;
  },

  // Cập nhật giấy tờ
  update: async (
    id: string,
    data: Partial<IdentifyDocumentRequest>
  ): Promise<ItemBaseResponse<IdentifyDocumentResponse>> => {
    const response = await api.put<ItemBaseResponse<IdentifyDocumentResponse>>(
      `/api/IdentifyDocument/${id}`,
      data
    );
    return response.data;
  },

  // Xóa giấy tờ
  delete: async (id: string): Promise<ItemBaseResponse<void>> => {
    const response = await api.delete<ItemBaseResponse<void>>(
      `/api/IdentifyDocument/${id}`
    );
    return response.data;
  },
  updateStatus: async (
    id: string,
    data: { status: "APPROVED" | "REJECTED"; note?: string }
  ): Promise<ItemBaseResponse<IdentifyDocumentResponse>> => {
    const response = await api.patch<
      ItemBaseResponse<IdentifyDocumentResponse>
    >(`/api/IdentifyDocument/${id}/status`, data);
    return response.data;
  },
};
