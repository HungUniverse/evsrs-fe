// Role: 1 = Admin, 2 = Staff, 3 = User
export type RoleCode = 1 | 2 | 3;

export type User = {
  id: string | number;
  name: string;
  email: string;
  role: RoleCode;
};

// Dữ liệu form login
export type LoginRequest = {
  email: string;
  password: string;
};

// Backend (hoặc mock) trả về khi login thành công
export type LoginResponse = {
  accessToken: string; // token giả hoặc token từ backend
  user: User; // thông tin user kèm role
};
