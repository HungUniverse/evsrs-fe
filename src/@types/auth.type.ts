export type RoleCode = "ADMIN" | "USER" | "STAFF";

export interface User {
  id?: string; // optional: lấy từ nhiều claim khác nhau
  userId?: string; // primary id
  name?: string;
  email?: string;
  phone?: string;
  role: RoleCode;
  avatar?: string;
  username?: string;
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
