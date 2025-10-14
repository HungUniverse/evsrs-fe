export type RoleCode = "ADMIN" | "USER" | "STAFF";

export interface User {
  id?: string; // optional: lấy từ nhiều claim khác nhau
  userId?: string; // primary id
  name?: string;
  email?: string;
  phone?: string;
  role: RoleCode;
  avatar?: string;
  userName?: string;
}

export interface UserFull {
  id: string; // từ API
  userId: string; // alias = id (để UI cũ vẫn dùng được)
  userName: string;
  userEmail: string;
  phoneNumber: string | null;
  fullName: string | null;
  role: RoleCode;
  dateOfBirth: string;
  isVerify: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  notificationToken?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface LogoutBody {
  refreshToken: string;
}
