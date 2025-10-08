// Role: 1 = Admin, 2 = Staff, 3 = User
export type RoleCode = 1 | 2 | 3;
import type { User } from "./customer";

// ✅ ĐÚNG: identifier (không phải "indentifier")
export type LoginRequest = {
  identifier: string; // email HOẶC phone
  password: string;
};

export type SendOtpRequest = { email: string; phoneNumber: string };
export type VerifyOtpRequest = {
  email: string;
  code: string;
  otpType: "REGISTER" | "RESET_PASSWORD";
};

export type CompleteRegisterRequest = SendOtpRequest & { password: string };

export type ApiResp<T> = { success: boolean; message?: string; data?: T };

export type LoginResponse = {
  accessToken: string;
  user: User;
};
