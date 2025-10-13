import { api } from "@/lib/axios/axios";

// Generic API Response type
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  code: string;
}

export interface IdentifyUserSummary {
  id: string;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface IdentifyDocumentRequest {
  userId: string;
  frontImage: string; // base64
  backImage: string;  // base64
  countryCode: string;
  numberMasked: string;
  licenseClass: string;
  expireAt: string; // ISO 8601
  status: "PENDING" | "APPROVED" | "REJECTED";
  verifiedBy?: string;
  verifiedAt?: string; // ISO 8601
  note?: string;
}

export interface IdentifyDocumentResponse {
  id: string;
  user: IdentifyUserSummary | null;
  type: string;
  countryCode: string;
  numberMasked: string;
  licenseClass: string;
  expireAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  frontImage: string | null;
  backImage: string | null;
  verifiedBy?: string;
  verifiedAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  isDeleted: boolean;
}


export const identifyDocumentAPI = {
  // Upload giấy tờ định danh
  upload: async (data: IdentifyDocumentRequest): Promise<ApiResponse<IdentifyDocumentResponse>> => {
    const response = await api.post<ApiResponse<IdentifyDocumentResponse>>("/api/IdentifyDocument", data);
    return response.data;
  },

  // Lấy danh sách giấy tờ của user
  getUserDocuments: async (userId: string): Promise<ApiResponse<IdentifyDocumentResponse>> => {
    const response = await api.get<ApiResponse<IdentifyDocumentResponse>>(`/api/IdentifyDocument/user/${userId}`);
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
