import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response"; // nếu không có, bỏ wrapper này đi
import {
  type RefreshTokenResponse,
  type LoginRequest,
  type LoginResponse,
  type LogoutBody,
} from "@/@types/auth.type";

export const authAPI = {
  login: (body: LoginRequest) =>
    api.post<ItemBaseResponse<LoginResponse> | LoginResponse>(
      "/api/Auth/signin",
      body
    ),

  logout: (body: LogoutBody) =>
    api.post<ItemBaseResponse<null> | null>("/api/Auth/logout", body),

  sendOtp: (data: { email?: string; phoneNumber?: string }) =>
    api.post("/api/Auth/send-otp", data),
  resendOtp: (data: { email?: string; phoneNumber?: string }) =>
    api.post("/api/Auth/resend-otp", data),
  verifyOtp: (data: {
    email: string;
    code: string;
    otpType: "REGISTER" | "FORGOT_PASSWORD";
  }) => api.post("/api/Auth/verify-otp", data),
  completeRegister: (data: {
    email: string;
    phoneNumber: string;
    password: string;
  }) => api.post("/api/Auth/complete-register", data),
  refreshToken: (refreshToken: string) =>
    api.post<ItemBaseResponse<RefreshTokenResponse>>(
      "/api/Auth/refresh-token",
      { refreshToken }
    ),
};
