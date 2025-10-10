import type { LoginRequest, LoginResponse } from "@/@types/auth.type";
import type { User } from "@/@types/customer";

export const mockUsers: User[] = [
  {
    id: "u1",
    userName: "admin",
    password: "123456",
    fullName: "Admin User",
    email: "admin@evsrs.com",
    dob: "1990-01-01",
    phoneNumber: "0900000001",
    profilePicture:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: 1,
    cccd: "001234567890",
    gplx: "A1234567890",
    gender: "Nam",
  },
  {
    id: "u2",
    userName: "staff",
    password: "123456",
    fullName: "Staff User",
    email: "staff@evsrs.com",
    dob: "1992-02-02",
    phoneNumber: "0900000002",
    profilePicture:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    role: 2,
    cccd: "002345678901",
    gplx: "B2345678901",
    gender: "Nam",
  },
  {
    id: "u3",
    userName: "user",
    password: "123456",
    fullName: "Normal User",
    email: "user@evsrs.com",
    dob: "1995-03-03",
    phoneNumber: "0900000003",
    profilePicture:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    role: 3,
    cccd: "003456789012",
    gplx: "C3456789012",
    gender: "Nam",
  },
  {
    id: "u4",
    userName: "user1",
    password: "123456",
    fullName: "User One",
    email: "user4@evsrs.com",
    dob: "1998-04-04",
    phoneNumber: "0900000004",
    profilePicture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    role: 3,
    cccd: "004567890123",
    gplx: "D4567890123",
    gender: "Nam",
  },
  {
    id: "u5",
    userName: "user2",
    password: "123456",
    fullName: "User Two",
    email: "user5@evsrs.com",
    dob: "2000-05-05",
    phoneNumber: "0900000005",
    profilePicture:
      "https://images.unsplash.com/photo-1603415526960-f7e0328d13f6?w=150&h=150&fit=crop&crop=face",
    role: 3,
    cccd: "005678901234",
    gplx: "E5678901234",
    gender: "Nữ",
  },
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
