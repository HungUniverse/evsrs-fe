import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { LoginRequest, RoleCode } from "@/@types/auth.type";
import { authAPI } from "@/apis/auth.api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: ReturnType<typeof useAuthStore.getState>["user"];
  hasRole: (r: RoleCode) => boolean;
  login: (body: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, save, clear, refreshToken } = useAuthStore();

  const hasRole = useCallback(
    (r: RoleCode) => !!user && user.role === r,
    [user]
  );

  const login = useCallback(
    async (body: LoginRequest) => {
      const res = await authAPI.login(body);
      // có thể là ItemBaseResponse bọc data, hoặc trả thẳng
      const payload: any = res.data;
      const data = payload?.data ?? payload;

      if (!data?.accessToken || !data?.refreshToken) {
        throw new Error("Đăng nhập thất bại: thiếu token");
      }

      save({ accessToken: data.accessToken, refreshToken: data.refreshToken });

      const role = useAuthStore.getState().user?.role;
      if (role === 1) navigate("/admin", { replace: true });
      else if (role === 2) navigate("/staff", { replace: true });
      else navigate("/", { replace: true });
    },
    [navigate, save]
  );

  const logout = useCallback(async () => {
    try {
      if (refreshToken) await authAPI.logout({ refreshToken });
    } finally {
      clear();
      navigate("/", { replace: true });
    }
  }, [navigate, clear, refreshToken]);

  const value = useMemo<AuthContextType>(
    () => ({ isAuthenticated, user, hasRole, login, logout }),
    [isAuthenticated, user, hasRole, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
