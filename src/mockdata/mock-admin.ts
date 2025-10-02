// Mock data for admin dashboard

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalCars: number;
  totalCustomers: number;
  activeRentals: number;
  availableCars: number;
  monthlyRevenue: number;
  customerSatisfaction: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalBookings: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
  joinDate: string;
  lastBooking: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  position: string;
  department: string;
  status: "active" | "inactive";
  joinDate: string;
  salary: number;
}

export interface RentalLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  totalCars: number;
  availableCars: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  manager: string;
  status: "active" | "inactive";
}

export interface RecentBooking {
  id: string;
  customerName: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "confirmed" | "ongoing" | "completed" | "cancelled";
  location: string;
}

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 125000000,
  totalBookings: 2456,
  totalCars: 156,
  totalCustomers: 892,
  activeRentals: 89,
  availableCars: 67,
  monthlyRevenue: 18500000,
  customerSatisfaction: 4.7,
};

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0123456789",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    totalBookings: 12,
    totalSpent: 8500000,
    status: "active",
    joinDate: "2024-01-15",
    lastBooking: "2024-12-20",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "tranthibinh@gmail.com",
    phone: "0987654321",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalBookings: 8,
    totalSpent: 6200000,
    status: "active",
    joinDate: "2024-02-20",
    lastBooking: "2024-12-18",
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    email: "leminhcuong@gmail.com",
    phone: "0369258147",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    totalBookings: 15,
    totalSpent: 11200000,
    status: "active",
    joinDate: "2023-11-10",
    lastBooking: "2024-12-15",
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "phamthidung@gmail.com",
    phone: "0741852963",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    totalBookings: 5,
    totalSpent: 3800000,
    status: "inactive",
    joinDate: "2024-03-05",
    lastBooking: "2024-11-30",
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    phone: "0529637410",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    totalBookings: 20,
    totalSpent: 15800000,
    status: "active",
    joinDate: "2023-08-15",
    lastBooking: "2024-12-22",
  },
];

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Nguyễn Thị Admin",
    email: "admin@evsrs.com",
    phone: "0123456789",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    position: "Quản trị viên",
    department: "Quản lý",
    status: "active",
    joinDate: "2023-01-01",
    salary: 25000000,
  },
  {
    id: "2",
    name: "Trần Văn Manager",
    email: "manager@evsrs.com",
    phone: "0987654321",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    position: "Quản lý đội xe",
    department: "Vận hành",
    status: "active",
    joinDate: "2023-03-15",
    salary: 18000000,
  },
  {
    id: "3",
    name: "Lê Thị Staff",
    email: "staff@evsrs.com",
    phone: "0369258147",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    position: "Nhân viên chăm sóc khách hàng",
    department: "Dịch vụ",
    status: "active",
    joinDate: "2023-06-01",
    salary: 12000000,
  },
  {
    id: "4",
    name: "Phạm Văn Tech",
    email: "tech@evsrs.com",
    phone: "0741852963",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    position: "Kỹ thuật viên",
    department: "Kỹ thuật",
    status: "active",
    joinDate: "2023-09-10",
    salary: 15000000,
  },
  {
    id: "5",
    name: "Hoàng Thị Finance",
    email: "finance@evsrs.com",
    phone: "0529637410",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    position: "Kế toán",
    department: "Tài chính",
    status: "active",
    joinDate: "2023-02-20",
    salary: 16000000,
  },
];

export const mockRentalLocations: RentalLocation[] = [
  {
    id: "1",
    name: "Trung tâm Quận 1",
    address: "123 Nguyễn Huệ, Quận 1",
    city: "TP. Hồ Chí Minh",
    totalCars: 45,
    availableCars: 32,
    coordinates: { lat: 10.7769, lng: 106.7009 },
    manager: "Trần Văn A",
    status: "active",
  },
  {
    id: "2",
    name: "Trung tâm Quận 7",
    address: "456 Nguyễn Thị Thập, Quận 7",
    city: "TP. Hồ Chí Minh",
    totalCars: 38,
    availableCars: 25,
    coordinates: { lat: 10.7374, lng: 106.7224 },
    manager: "Lê Thị B",
    status: "active",
  },
  {
    id: "3",
    name: "Trung tâm Hà Nội",
    address: "789 Hoàng Hoa Thám, Ba Đình",
    city: "Hà Nội",
    totalCars: 42,
    availableCars: 28,
    coordinates: { lat: 21.0285, lng: 105.8542 },
    manager: "Phạm Văn C",
    status: "active",
  },
  {
    id: "4",
    name: "Trung tâm Đà Nẵng",
    address: "321 Lê Duẩn, Hải Châu",
    city: "Đà Nẵng",
    totalCars: 31,
    availableCars: 22,
    coordinates: { lat: 16.0544, lng: 108.2022 },
    manager: "Hoàng Thị D",
    status: "active",
  },
];

export const mockRecentBookings: RecentBooking[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn An",
    carName: "VinFast VF3",
    startDate: "2024-12-25",
    endDate: "2024-12-27",
    totalAmount: 1180000,
    status: "confirmed",
    location: "Trung tâm Quận 1",
  },
  {
    id: "2",
    customerName: "Trần Thị Bình",
    carName: "Honda City 2020",
    startDate: "2024-12-23",
    endDate: "2024-12-24",
    totalAmount: 1200000,
    status: "ongoing",
    location: "Trung tâm Quận 7",
  },
  {
    id: "3",
    customerName: "Lê Minh Cường",
    carName: "Toyota Camry 2022",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    totalAmount: 2400000,
    status: "completed",
    location: "Trung tâm Hà Nội",
  },
  {
    id: "4",
    customerName: "Phạm Thị Dung",
    carName: "Hyundai Kona 2021",
    startDate: "2024-12-18",
    endDate: "2024-12-19",
    totalAmount: 1414000,
    status: "completed",
    location: "Trung tâm Đà Nẵng",
  },
  {
    id: "5",
    customerName: "Hoàng Văn Em",
    carName: "Kia Seltos 2021",
    startDate: "2024-12-21",
    endDate: "2024-12-23",
    totalAmount: 1440000,
    status: "confirmed",
    location: "Trung tâm Quận 1",
  },
];
