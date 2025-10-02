// src/lib/zustand/use-auth-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RoleCode } from "@/@types/auth.type";
import type { User } from "@/@types/customer";

// 1 = Admin, 2 = Staff, 3 = User
type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // actions
  loginSuccess: (payload: { token: string; user: User }) => void;
  setUser: (user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  clear: () => void; // alias của logout cho tương thích code cũ

  // helpers
  hasRole: (r: RoleCode) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Gọi sau khi login API trả về { token, user }
      loginSuccess: ({ token, user }) =>
        set({ token, user, isAuthenticated: true }),

      setUser: (user) => set({ user }),
      updateUser: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),

      setToken: (token) =>
        set({ token, isAuthenticated: !!token && !!get().user }),

      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      clear: () => set({ token: null, user: null, isAuthenticated: false }),

      hasRole: (r) => get().user?.role === r,
    }),
    {
      name: "auth-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

// ——— Selectors tiện dùng (tuỳ chọn) ———
export const selectUser = (s: AuthState) => s.user;
export const selectToken = (s: AuthState) => s.token;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectHasRole = (r: RoleCode) => (s: AuthState) =>
  s.user?.role === r;
