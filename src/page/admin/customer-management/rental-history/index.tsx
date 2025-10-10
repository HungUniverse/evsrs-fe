// Removed unused imports after refactor
import { useState } from "react";
import StatsCards from "./components/StatsCards";
import FilterBar from "./components/FilterBar";
import RentalHistoryTable from "./components/RentalHistoryTable";

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

// Presentational constants moved into child components

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

  // Formatting handled inside child components where needed

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
      <StatsCards rentals={mockRentalHistory as any} />

      {/* Search and Filter */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Rental History Table */}
      <RentalHistoryTable rentals={filteredHistory as any} />
    </div>
  );
}
