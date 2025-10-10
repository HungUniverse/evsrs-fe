// Removed unused icon after refactor
import { useState } from "react";
import StatsCards from "./components/StatsCards";
import FilterBar from "./components/FilterBar";
import ComplaintsTable from "./components/ComplaintsTable";

// Mock data for complaints
const mockComplaints = [
  {
    id: "CMP-001",
    customerName: "Nguyễn Văn An",
    customerId: "CUS-0001",
    customerEmail: "an.nguyen@example.com",
    customerPhone: "0901234567",
    complaintDate: "2024-11-15T10:30:00Z",
    type: "service",
    priority: "high",
    status: "pending",
    title: "Xe giao trễ 30 phút",
    description: "Tôi đã đặt xe lúc 9h sáng nhưng đến 9h30 xe mới được giao. Điều này làm tôi bị trễ cuộc họp quan trọng.",
    rentalId: "RH-001",
    carName: "VinFast VF3",
    assignedTo: null,
    resolution: null,
    resolvedAt: null,
    createdAt: "2024-11-15T10:30:00Z",
  },
  {
    id: "CMP-002",
    customerName: "Trần Thị Bình",
    customerId: "CUS-0002",
    customerEmail: "binh.tran@example.com",
    customerPhone: "0912345678",
    complaintDate: "2024-11-20T14:15:00Z",
    type: "billing",
    priority: "medium",
    status: "resolved",
    title: "Phí vệ sinh quá cao",
    description: "Phí vệ sinh 200,000 VND là quá cao so với thông báo ban đầu. Tôi không đồng ý với mức phí này.",
    rentalId: "RH-002",
    carName: "Honda City 2020",
    assignedTo: "ADM-001",
    resolution: "Đã giảm phí vệ sinh xuống 100,000 VND và gửi lời xin lỗi đến khách hàng.",
    resolvedAt: "2024-11-21T09:00:00Z",
    createdAt: "2024-11-20T14:15:00Z",
  },
  {
    id: "CMP-003",
    customerName: "Lê Minh Cường",
    customerId: "CUS-0003",
    customerEmail: "cuong.le@example.com",
    customerPhone: "0987654321",
    complaintDate: "2024-11-25T16:45:00Z",
    type: "vehicle",
    priority: "high",
    status: "pending",
    title: "Xe có vấn đề về động cơ",
    description: "Khi lái xe, tôi nghe thấy tiếng động lạ từ động cơ. Cần kiểm tra ngay để đảm bảo an toàn.",
    rentalId: "RH-003",
    carName: "Toyota Camry 2022",
    assignedTo: null,
    resolution: null,
    resolvedAt: null,
    createdAt: "2024-11-25T16:45:00Z",
  },
  {
    id: "CMP-004",
    customerName: "Phạm Thị Dung",
    customerId: "CUS-0004",
    customerEmail: "dung.pham@example.com",
    customerPhone: "0933334444",
    complaintDate: "2024-11-10T11:20:00Z",
    type: "service",
    priority: "low",
    status: "rejected",
    title: "Nhân viên không thân thiện",
    description: "Nhân viên giao xe có thái độ không thân thiện và không hướng dẫn sử dụng xe đầy đủ.",
    rentalId: "RH-004",
    carName: "Hyundai Kona 2021",
    assignedTo: "STF-012",
    resolution: "Đã xác minh và nhân viên đã được đào tạo lại về thái độ phục vụ.",
    resolvedAt: "2024-11-12T15:30:00Z",
    createdAt: "2024-11-10T11:20:00Z",
  },
  {
    id: "CMP-005",
    customerName: "Hoàng Văn Em",
    customerId: "CUS-0005",
    customerEmail: "em.hoang@example.com",
    customerPhone: "0971112222",
    complaintDate: "2024-11-28T08:15:00Z",
    type: "billing",
    priority: "medium",
    status: "in_progress",
    title: "Tính phí sai",
    description: "Tôi thuê xe 2 ngày nhưng bị tính phí cho 3 ngày. Cần kiểm tra lại hóa đơn.",
    rentalId: "RH-005",
    carName: "Kia Seltos 2021",
    assignedTo: "ADM-002",
    resolution: null,
    resolvedAt: null,
    createdAt: "2024-11-28T08:15:00Z",
  },
];

export default function ComplaintsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Formatting and icons handled inside child components

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xử lý khiếu nại</h1>
          <p className="text-muted-foreground">
            Quản lý và xử lý các khiếu nại từ khách hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards complaints={mockComplaints as any} />

      {/* Search and Filter */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      {/* Complaints Table */}
      <ComplaintsTable complaints={filteredComplaints as any} />
    </div>
  );
}
