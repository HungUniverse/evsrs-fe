import type { Customer } from "@/@types/customer";

export const mockCustomers: Customer[] = [
  {
    id: "cus-001",
    userName: "nguyenhuy",
    password: "123456", // giả lập hash
    fullName: "Nguyễn Văn Huy",
    email: "huynguyen@example.com",
    dob: "1997-05-12",
    phoneNumber: "0912345678",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "cus-002",
    userName: "lantran",
    password: "123456",
    fullName: "Trần Thị Lan",
    email: "lantran@example.com",
    dob: "1995-09-30",
    phoneNumber: "0987654321",
    profilePicture:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];
