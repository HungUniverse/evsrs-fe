import { api } from "@/lib/axios/axios";

// Generic API Response type
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  code: string;
}

export interface IdentifyDocumentRequest {
  userId: string;
  type: string;
  countryCode: string;
  numberMasked: string;
  licenseClass: string;
  expireAt: Date;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedBy?: string;
  verifiedAt?: Date;
  note?: string;
}

export interface IdentifyDocumentResponse {
  id: string;
  user: unknown | null;
  type: string;
  countryCode: string;
  numberMasked: string;
  licenseClass: string;
  expireAt: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedBy?: string;
  verifiedAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  code: string;
}

export const identifyDocumentAPI = {
  // Upload giấy tờ định danh
  upload: async (data: IdentifyDocumentRequest): Promise<ApiResponse<IdentifyDocumentResponse>> => {
    const response = await api.post<ApiResponse<IdentifyDocumentResponse>>("/api/IdentifyDocument", data);
    return response.data;
  },

  // Lấy danh sách giấy tờ của user
  getUserDocuments: async (userId: string): Promise<ApiResponse<IdentifyDocumentResponse[]>> => {
    const response = await api.get<ApiResponse<IdentifyDocumentResponse[]>>(`/api/IdentifyDocument/user/${userId}`);
    return response.data;
  },

  // Lấy thông tin giấy tờ theo ID
  getById: async (id: string): Promise<ApiResponse<IdentifyDocumentResponse>> => {
    const response = await api.get<ApiResponse<IdentifyDocumentResponse>>(`/api/IdentifyDocument/${id}`);
    return response.data;
  },

  // Cập nhật giấy tờ
  update: async (id: string, data: Partial<IdentifyDocumentRequest>): Promise<ApiResponse<IdentifyDocumentResponse>> => {
    const response = await api.put<ApiResponse<IdentifyDocumentResponse>>(`/api/IdentifyDocument/${id}`, data);
    return response.data;
  },

  // Xóa giấy tờ
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/api/IdentifyDocument/${id}`);
    return response.data;
  },
};
