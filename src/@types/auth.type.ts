export type RoleCode = 1 | 2 | 3;

//1 admin 3user
export interface User {
  id?: string; // optional: lấy từ nhiều claim khác nhau
  userId?: string; // primary id
  name?: string;
  email?: string;
  role: RoleCode;
  avatar?: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  // theo swagger: identifier + password
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
  refreshToken?: string; // BE có thể trả lại hoặc không
}

export interface LogoutBody {
  refreshToken: string;
}
