// Mock data for admin dashboard

//Export type
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
  id: string;                     // ID khách hàng (UUID hoặc auto increment)
  fullName: string;
  userName: string;
  email?: string;
  phoneNumber: string;
  profilePicture?: string;
  dob?: string;           // YYYY-MM-DD
  address?: string;
  gender?: "Male" | "Female" | "Other";

  // Giấy tờ & xác thực
  cccd?: string;          // CCCD / CMND
  gplx?: string;
  cccdImageUrl?: string;        // link ảnh CCCD/CMND
  gplxImageUrl?: string; // link ảnh GPLX
  verificationStatus: "Pending" | "Verified" | "Rejected";
  verifiedBy?: string;            // id admin hoặc staff đã xác thực
  verifiedAt?: string;            // ISO datetime
  rejectedAt?: string;            // ISO datetime khi bị từ chối

  // Lịch sử thuê & rủi ro
  totalRentals: number;          // tổng số lượt thuê
  totalViolations: number;       // số lần vi phạm (gây hư hỏng, trễ hạn,...)
  riskLevel?: "Low" | "Medium" | "High"; // hệ thống tính từ behavior
  lastRentalDate?: string;
  lastComplaintDate?: string;

  // Khiếu nại & ghi chú
  complaints?: {
    complaintId: string;
    date: string;
    content: string;
    status: "Pending" | "Resolved" | "Rejected";
  }[];

  // Metadata
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;              // tài khoản bị khoá hay không
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


export type VerificationAudit = {
  at: string;            // ISO datetime
  by: string;            // adminId
  from: "Pending" | "Verified" | "Rejected";
  to: "Pending" | "Verified" | "Rejected";
  action:
    | "verify"
    | "demote_to_pending"
    | "reject"
    | "reopen_pending"
    | "verify_after_reject";
  reason?: string;
  note?: string;
  evidenceLinks?: string[];
  checklist?: {
    hasCCCD: boolean;
    hasGPLX: boolean;
    nameDobMatched: boolean;
    licenseValid: boolean;
    isActive: boolean;
    notRejected: boolean;
  };
};

// Mock data
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
    id: "CUS-0001",
    fullName: "Nguyễn Văn An",
    userName: "nguyenvanan",
    email: "an.nguyen@example.com",
    phoneNumber: "0901234567",
    profilePicture:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face",
    dob: "1992-05-12",
    address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
    gender: "Male",
    cccd: "079203001234",
    gplx: "790123456789",
    cccdImageUrl: "https://cdn.thuvienphapluat.vn/tintuc/uploads/image/2021/01/27/can-cuoc-cong-dan-gan-chip-2(1).jpg",
    gplxImageUrl: "https://xdcs.cdnchinhphu.vn/446259493575335936/2025/3/3/1-17410134386701821380489.jpg",
    verificationStatus: "Pending",
    verifiedBy: "ADM-001",
    verifiedAt: "2024-11-10T09:23:11Z",
    totalRentals: 12,
    totalViolations: 0,
    riskLevel: "Low",
    lastRentalDate: "2025-09-20",
    createdAt: "2023-12-01T08:15:00Z",
    updatedAt: "2025-09-21T10:02:00Z",
    isActive: true,
  },
  {
    id: "CUS-0002",
    fullName: "Trần Thị Bình",
    userName: "tranbinh",
    email: "binh.tran@example.com",
    phoneNumber: "0912345678",
    profilePicture:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    dob: "1995-08-22",
    address: "45 Lê Lợi, Quận Hải Châu, Đà Nẵng",
    gender: "Female",
    cccd: "201903009876",
    gplx: "430987654321",
    cccdImageUrl: "https://cdn.thuvienphapluat.vn/tintuc/uploads/image/2021/01/27/can-cuoc-cong-dan-gan-chip-2(1).jpg",
    gplxImageUrl: "https://xdcs.cdnchinhphu.vn/446259493575335936/2025/3/3/1-17410134386701821380489.jpg",
    verificationStatus: "Pending",
    verifiedBy: "STF-012",
    verifiedAt: "2025-01-03T12:45:30Z",
    totalRentals: 7,
    totalViolations: 1,
    riskLevel: "Medium",
    lastRentalDate: "2025-08-30",
    lastComplaintDate: "2025-06-01",
    complaints: [
      {
        complaintId: "CMP-1001",
        date: "2025-06-01",
        content: "Xe giao trễ 30 phút",
        status: "Resolved",
      },
    ],
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2025-08-31T09:10:00Z",
    isActive: true,
  },
  {
    id: "CUS-0003",
    fullName: "Lê Minh Cường",
    userName: "lecuong",
    email: "cuong.le@example.com",
    phoneNumber: "0987654321",
    profilePicture:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    dob: "1988-11-03",
    address: "78 Hoàng Hoa Thám, Ba Đình, Hà Nội",
    gender: "Male",
    cccd: "011288001122",
    gplx: "010112223333",
    verificationStatus: "Pending",
    totalRentals: 0,
    totalViolations: 0,
    riskLevel: "Low",
    createdAt: "2025-09-01T07:30:00Z",
    isActive: false,
  },
  {
    id: "CUS-0004",
    fullName: "Phạm Thị Dung",
    userName: "phamthidung",
    email: "dung.pham@example.com",
    phoneNumber: "0933334444",
    profilePicture:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
    dob: "1990-02-14",
    address: "9 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    gender: "Female",
    cccd: "011190004455",
    gplx: "010144556677",
    verificationStatus: "Pending",
    verifiedBy: "ADM-002",
    verifiedAt: "2024-08-20T14:00:00Z",
    totalRentals: 21,
    totalViolations: 2,
    riskLevel: "Medium",
    lastRentalDate: "2025-09-15",
    createdAt: "2022-10-11T09:00:00Z",
    updatedAt: "2025-09-16T11:11:00Z",
    isActive: true,
  },
  {
    id: "CUS-0005",
    fullName: "Hoàng Văn Em",
    userName: "hoangvanem",
    email: "em.hoang@example.com",
    phoneNumber: "0971112222",
    profilePicture:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face",
    dob: "1997-07-07",
    address: "150 Lý Thường Kiệt, Quận 10, TP.HCM",
    gender: "Male",
    cccd: "079297001919",
    gplx: "790199977777",
    cccdImageUrl: "https://cdn.thuvienphapluat.vn/tintuc/uploads/image/2021/01/27/can-cuoc-cong-dan-gan-chip-2(1).jpg",
    gplxImageUrl: "https://xdcs.cdnchinhphu.vn/446259493575335936/2025/3/3/1-17410134386701821380489.jpg",
    verificationStatus: "Pending",
    verifiedBy: "STF-003",
    verifiedAt: "2025-05-12T08:00:00Z",
    totalRentals: 2,
    totalViolations: 1,
    riskLevel: "Medium",
    lastComplaintDate: "2025-05-13",
    complaints: [
      {
        complaintId: "CMP-1020",
        date: "2025-05-13",
        content: "Phí vệ sinh quá cao",
        status: "Rejected",
      },
    ],
    createdAt: "2024-06-06T06:06:00Z",
    updatedAt: "2025-05-13T12:00:00Z",
    isActive: true,
  },
  {
    id: "CUS-0006",
    fullName: "Đặng Thu Hà",
    userName: "dangthuha",
    email: "ha.dang@example.com",
    phoneNumber: "0965556666",
    profilePicture:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
    dob: "1993-12-01",
    address: "21 Võ Văn Kiệt, Quận 1, TP.HCM",
    gender: "Female",
    cccd: "079293006543",
    gplx: "790165432109",
    cccdImageUrl: "https://cdn.thuvienphapluat.vn/tintuc/uploads/image/2021/01/27/can-cuoc-cong-dan-gan-chip-2(1).jpg",
    gplxImageUrl: "https://xdcs.cdnchinhphu.vn/446259493575335936/2025/3/3/1-17410134386701821380489.jpg",
    verificationStatus: "Pending",
    verifiedBy: "ADM-003",
    verifiedAt: "2024-03-18T10:10:10Z",
    totalRentals: 15,
    totalViolations: 0,
    riskLevel: "Low",
    lastRentalDate: "2025-09-28",
    createdAt: "2023-03-19T09:00:00Z",
    updatedAt: "2025-09-28T09:30:00Z",
    isActive: true,
  },
  {
    id: "CUS-0007",
    fullName: "Võ Quốc Huy",
    userName: "voquochuy",
    email: "huy.vo@example.com",
    phoneNumber: "0950001111",
    profilePicture:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?w=200&h=200&fit=crop&crop=face",
    dob: "1986-10-20",
    address: "98 Nguyễn Thị Định, Quận 2, TP.HCM",
    gender: "Male",
    cccd: "079286004477",
    gplx: "790144778899",
    verificationStatus: "Pending",
    verifiedBy: "STF-018",
    verifiedAt: "2024-09-09T09:09:09Z",
    totalRentals: 3,
    totalViolations: 0,
    riskLevel: "Low",
    lastRentalDate: "2025-07-02",
    createdAt: "2024-07-01T08:00:00Z",
    isActive: true,
  },
  {
    id: "CUS-0008",
    fullName: "Phan Gia Khang",
    userName: "phangiakhang",
    email: "khang.phan@example.com",
    phoneNumber: "0942223333",
    profilePicture:
      "https://images.unsplash.com/photo-1542144612-1ba00456b5d5?w=200&h=200&fit=crop&crop=face",
    dob: "2000-01-15",
    address: "35 Phạm Hùng, Nam Từ Liêm, Hà Nội",
    gender: "Male",
    verificationStatus: "Pending",
    totalRentals: 0,
    totalViolations: 0,
    riskLevel: "Low",
    createdAt: "2025-09-25T12:00:00Z",
    isActive: true,
  },
  {
    id: "CUS-0009",
    fullName: "Bùi Thảo My",
    userName: "bui_thaomy",
    email: "my.bui@example.com",
    phoneNumber: "0938889999",
    profilePicture:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=200&h=200&fit=crop&crop=face",
    dob: "1998-03-09",
    address: "22 Trần Não, TP. Thủ Đức",
    gender: "Female",
    cccd: "079298002244",
    gplx: "790122446688",
    verificationStatus: "Pending",
    verifiedBy: "ADM-001",
    verifiedAt: "2024-07-21T07:00:00Z",
    totalRentals: 9,
    totalViolations: 0,
    riskLevel: "Low",
    lastRentalDate: "2025-08-01",
    createdAt: "2023-08-02T10:00:00Z",
    updatedAt: "2025-08-02T08:00:00Z",
    isActive: true,
  },
  {
    id: "CUS-0010",
    fullName: "Tạ Đức Nam",
    userName: "taducnam",
    email: "nam.ta@example.com",
    phoneNumber: "0921231234",
    profilePicture:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face",
    dob: "1984-04-30",
    address: "5B Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    gender: "Male",
    cccd: "079284003355",
    gplx: "790133559900",
    cccdImageUrl: "https://cdn.thuvienphapluat.vn/tintuc/uploads/image/2021/01/27/can-cuoc-cong-dan-gan-chip-2(1).jpg",
    gplxImageUrl: "https://xdcs.cdnchinhphu.vn/446259493575335936/2025/3/3/1-17410134386701821380489.jpg",
    verificationStatus: "Pending",
    verifiedBy: "STF-020",
    verifiedAt: "2023-12-12T12:12:12Z",
    totalRentals: 30,
    totalViolations: 3,
    riskLevel: "High",
    lastRentalDate: "2025-09-10",
    lastComplaintDate: "2025-01-08",
    complaints: [
      {
        complaintId: "CMP-0901",
        date: "2025-01-08",
        content: "Bàn giao xe không sạch",
        status: "Resolved",
      },
    ],
    createdAt: "2021-06-15T09:00:00Z",
    updatedAt: "2025-09-11T10:10:00Z",
    isActive: true,
  },
];

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Nguyễn Thị Anh",
    email: "anh@evsrs.com",
    phone: "0123456789",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    position: "Trưởng phòng nhân sự",
    department: "Nhân sự",
    status: "active",
    joinDate: "2023-01-01",
    salary: 25000000,
  },
  {
    id: "2",
    name: "Trần Văn B",
    email: "b@evsrs.com",
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
    name: "Lê Thị C",
    email: "c@evsrs.com",
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
    name: "Phạm Văn D",
    email: "d@evsrs.com",
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
    name: "Hoàng Thị E",
    email: "e@evsrs.com",
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
