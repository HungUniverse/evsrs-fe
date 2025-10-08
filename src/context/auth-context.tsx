import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { LoginRequest, LoginResponse, RoleCode } from "@/@types/auth.type";
import { apiAuth } from "@/lib/api";
import authAPI from "@/apis/auth.api";
import { useNavigate } from "react-router-dom";
import type { User } from "@/@types/customer";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (body: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (r: RoleCode) => boolean;
  apiMe: <T>(path: string, init?: RequestInit) => Promise<T>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load từ localStorage khi mở trang
  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const { user, token } = JSON.parse(raw) as { user: User; token: string };
      setUser(user);
      setToken(token);
    }
  }, []);

  const saveAuth = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("auth", JSON.stringify({ user: u, token: t }));
    // Align with axios interceptor which reads localStorage["token"]
    localStorage.setItem("token", JSON.stringify(t));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
  };

  const login = useCallback(async (body: LoginRequest) => {
    // Use axios-based API hitting correct backend endpoint
    const resp = await authAPI.login(body);
    const payload = resp.data; // ApiResp<LoginResponse>
    if (!payload?.success || !payload?.data) {
      throw new Error(payload?.message || "Đăng nhập thất bại");
    }
    const data: LoginResponse = payload.data;
    saveAuth(data.user, data.accessToken);

    switch (data.user.role) {
      case 1:
        navigate("/admin", { replace: true });
        break;
      case 2:
        navigate("/staff", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  }, [navigate]);

  const logout = useCallback(() => {
    clearAuth();
    navigate("/", { replace: true });
  }, [navigate]);

  const hasRole = useCallback((r: RoleCode) => !!user && user.role === r, [user]);

  const apiMe = useCallback(<T,>(path: string, init: RequestInit = {}) => {
    if (!token) throw new Error("Not authenticated");
    return apiAuth<T>(path, token, init);
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      login,
      logout,
      hasRole,
      apiMe,
    }),
    [user, token, login, logout, hasRole, apiMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
