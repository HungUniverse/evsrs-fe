import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Chờ xử lý",
  in_progress: "Đang xử lý",
  resolved: "Đã giải quyết",
  rejected: "Đã từ chối",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const typeLabels = {
  service: "Dịch vụ",
  billing: "Thanh toán",
  vehicle: "Phương tiện",
  other: "Khác",
};

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khiếu nại</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>{mockComplaints.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockComplaints.filter(c => c.status === 'resolved').length} đã giải quyết
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>
              {mockComplaints.filter(c => c.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý ngay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>
              {mockComplaints.filter(c => c.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang được xử lý
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>
              {mockComplaints.filter(c => c.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockComplaints.filter(c => c.status === 'resolved').length / mockComplaints.length) * 100)}% tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên khách hàng, tiêu đề hoặc mã khiếu nại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="rejected">Đã từ chối</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khiếu nại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã KN</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Mức độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium">{complaint.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{complaint.customerName}</div>
                        <div className="text-sm text-muted-foreground">{complaint.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[complaint.type as keyof typeof typeLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{complaint.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {complaint.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[complaint.priority as keyof typeof priorityColors]}>
                        {priorityLabels[complaint.priority as keyof typeof priorityLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                        <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                          {statusLabels[complaint.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(complaint.complaintDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Chi tiết
                        </Button>
                        {complaint.status === 'pending' && (
                          <Button size="sm" variant="default">
                            Nhận xử lý
                          </Button>
                        )}
                        {complaint.status === 'in_progress' && (
                          <Button size="sm" variant="default">
                            Giải quyết
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
