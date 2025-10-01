import type { User, LoginRequest, LoginResponse } from "@/@types/auth.type";

export const mockUsers: User[] = [
  { id: "u1", name: "Admin User", email: "admin@evsrs.com", role: 1 },
  { id: "u2", name: "Staff User", email: "staff@evsrs.com", role: 2 },
  { id: "u3", name: "Normal User", email: "user@evsrs.com", role: 3 },
];

const PASSWORD = "123456";

export function mockLogin(body: LoginRequest): LoginResponse | null {
  const user = mockUsers.find((u) => u.email === body.email);
  if (!user) return null;
  if (body.password !== PASSWORD) return null;

  return {
    accessToken: "mock-token-" + user.id,
    user,
  };
}
