// @/@types/customer.ts
export type User = {
  id: string;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  fullName: string;
  role: "ADMIN" | "USER" | "STAFF";
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;

};
