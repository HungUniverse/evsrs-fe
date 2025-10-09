import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, MapPin, Car, Search, Filter } from "lucide-react";
import { useState } from "react";

// Mock data for rental history
const mockRentalHistory = [
  {
    id: "RH-001",
    customerName: "Nguyễn Văn An",
    customerId: "CUS-0001",
    carName: "VinFast VF3",
    carId: "CAR-001",
    licensePlate: "51A-12345",
    startDate: "2024-11-15",
    endDate: "2024-11-17",
    duration: 3,
    totalAmount: 1180000,
    status: "completed",
    pickupLocation: "Trung tâm Quận 1",
    returnLocation: "Trung tâm Quận 1",
    createdAt: "2024-11-14T10:00:00Z",
  },
  {
    id: "RH-002",
    customerName: "Trần Thị Bình",
    customerId: "CUS-0002",
    carName: "Honda City 2020",
    carId: "CAR-002",
    licensePlate: "51B-67890",
    startDate: "2024-11-20",
    endDate: "2024-11-22",
    duration: 3,
    totalAmount: 1200000,
    status: "completed",
    pickupLocation: "Trung tâm Quận 7",
    returnLocation: "Trung tâm Quận 7",
    createdAt: "2024-11-19T14:30:00Z",
  },
  {
    id: "RH-003",
    customerName: "Lê Minh Cường",
    customerId: "CUS-0003",
    carName: "Toyota Camry 2022",
    carId: "CAR-003",
    licensePlate: "51C-11111",
    startDate: "2024-11-25",
    endDate: "2024-11-27",
    duration: 3,
    totalAmount: 2400000,
    status: "ongoing",
    pickupLocation: "Trung tâm Hà Nội",
    returnLocation: "Trung tâm Hà Nội",
    createdAt: "2024-11-24T09:15:00Z",
  },
  {
    id: "RH-004",
    customerName: "Phạm Thị Dung",
    customerId: "CUS-0004",
    carName: "Hyundai Kona 2021",
    carId: "CAR-004",
    licensePlate: "51D-22222",
    startDate: "2024-11-10",
    endDate: "2024-11-12",
    duration: 3,
    totalAmount: 1414000,
    status: "cancelled",
    pickupLocation: "Trung tâm Đà Nẵng",
    returnLocation: "Trung tâm Đà Nẵng",
    createdAt: "2024-11-09T16:45:00Z",
  },
  {
    id: "RH-005",
    customerName: "Hoàng Văn Em",
    customerId: "CUS-0005",
    carName: "Kia Seltos 2021",
    carId: "CAR-005",
    licensePlate: "51E-33333",
    startDate: "2024-11-28",
    endDate: "2024-11-30",
    duration: 3,
    totalAmount: 1440000,
    status: "confirmed",
    pickupLocation: "Trung tâm Quận 1",
    returnLocation: "Trung tâm Quận 1",
    createdAt: "2024-11-27T11:20:00Z",
  },
];

const statusColors = {
  completed: "bg-green-100 text-green-800",
  ongoing: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  confirmed: "bg-yellow-100 text-yellow-800",
};

const statusLabels = {
  completed: "Hoàn thành",
  ongoing: "Đang thuê",
  cancelled: "Đã hủy",
  confirmed: "Đã xác nhận",
};

export default function RentalHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredHistory = mockRentalHistory.filter(rental => {
    const matchesSearch = rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || rental.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử thuê xe</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi lịch sử thuê xe của khách hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt thuê</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>{mockRentalHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockRentalHistory.filter(r => r.status === 'completed').length} đã hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang thuê</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>
              {mockRentalHistory.filter(r => r.status === 'ongoing').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Xe đang được thuê
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>
              {mockRentalHistory.filter(r => r.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Chờ nhận xe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">₫</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{color: '#00D166'}}>
              {formatCurrency(mockRentalHistory.reduce((sum, r) => sum + r.totalAmount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ các giao dịch hoàn thành
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
                placeholder="Tìm kiếm theo tên khách hàng, xe hoặc biển số..."
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
                <option value="completed">Hoàn thành</option>
                <option value="ongoing">Đang thuê</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rental History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thuê xe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã thuê</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Xe thuê</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Thành tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rental.customerName}</div>
                        <div className="text-sm text-muted-foreground">{rental.customerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rental.carName}</div>
                        <div className="text-sm text-muted-foreground">{rental.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">{rental.duration} ngày</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {rental.pickupLocation}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(rental.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[rental.status as keyof typeof statusColors]}>
                        {statusLabels[rental.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Chi tiết
                        </Button>
                        {rental.status === 'ongoing' && (
                          <Button size="sm" variant="destructive">
                            Hủy
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
