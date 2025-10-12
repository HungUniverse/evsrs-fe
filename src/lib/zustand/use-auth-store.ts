import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { decodeJwt, type JWTPayload } from "jose";
import type { RoleCode, User } from "@/@types/auth.type";

interface AuthStoreState {
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  user: User | null;
  save: (tokens: { accessToken: string; refreshToken: string }) => void;
  clear: () => void;
}

function extractUserFromJWT(token: string): User {
  const payload = decodeJwt(token) as JWTPayload & Record<string, unknown>;

  return {
    userId: payload.userId as string | undefined,
    name: payload.name as string | undefined,
    phone: payload.phone as string | undefined,
    email: payload.email as string | undefined,
    role: payload.role as RoleCode,
  };
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: "",
      refreshToken: "",
      user: null,
      save: ({ accessToken, refreshToken }) => {
        try {
          const user = extractUserFromJWT(accessToken);
          set({ isAuthenticated: true, accessToken, refreshToken, user });
        } catch (e) {
          console.error("Decode JWT fail:", e);
          set({
            isAuthenticated: false,
            accessToken: "",
            refreshToken: "",
            user: null,
          });
        }
      },
      clear: () =>
        set({
          isAuthenticated: false,
          accessToken: "",
          refreshToken: "",
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          try {
            const user = extractUserFromJWT(state.accessToken);
            state.isAuthenticated = true;
            state.user = user;
          } catch (e) {
            console.error("Rehydrate decode JWT fail:", e);
            state.isAuthenticated = false;
            state.user = null;
          }
        }
      },
    }
  )
);
