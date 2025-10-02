// @/@types/customer.ts
export type User = {
  id: string;
  userName: string;
  password: string;
  fullName: string;
  email: string;
  dob: string; // ISO string "YYYY-MM-DD"
  phoneNumber: string;
  profilePicture: string;
  role: number;
};
