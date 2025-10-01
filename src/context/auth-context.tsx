import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  LoginRequest,
  LoginResponse,
  RoleCode,
  User,
} from "@/@types/auth.type";
import { api, apiAuth } from "@/lib/api";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (body: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (r: RoleCode) => boolean;
  apiMe: <T>(path: string, init?: RequestInit) => Promise<T>; // call API có token
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
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  const login = async (body: LoginRequest) => {
    // Giả định backend trả đúng LoginResponse
    const data = await api<LoginResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(body),
    });
    saveAuth(data.user, data.accessToken);

    // Điều hướng theo role
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
  };

  const logout = () => {
    // (Nếu cần gọi /auth/logout thì gọi ở đây, nhưng đồ án có thể bỏ)
    clearAuth();
    navigate("/", { replace: true });
  };

  const hasRole = (r: RoleCode) => !!user && user.role === r;

  // helper gọi API có token (đỡ lặp lại)
  const apiMe = <T,>(path: string, init: RequestInit = {}) => {
    if (!token) throw new Error("Not authenticated");
    return apiAuth<T>(path, token, init);
  };

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
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
