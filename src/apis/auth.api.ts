// src/apis/auth.api.ts
import type { LoginRequest, LoginResponse } from "@/@types/auth.type";
import { mockLogin } from "@/mockdata/mock-user";

export const authAPI = {
  async login(body: LoginRequest): Promise<LoginResponse> {
    // Giả lập delay 500ms cho giống gọi API
    await new Promise((r) => setTimeout(r, 500));

    const res = mockLogin(body);
    if (!res) throw new Error("Sai email hoặc mật khẩu");
    return res;
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    return;
  },
};
