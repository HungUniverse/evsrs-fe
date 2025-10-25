import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CarEV } from "@/@types/car/carEv";
import type { CarManufacture } from "@/@types/car/carManufacture";

interface CarTableProps {
  cars: CarEV[];
  loading: boolean;
  onView: (car: CarEV) => void;
  onEdit: (car: CarEV) => void;
  manufacturerMap: Map<string, CarManufacture>;
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    AVAILABLE: {
      variant: "default" as const,
      label: "Sẵn sàng",
      className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    IN_USE: {
      variant: "secondary" as const,
      label: "Đang sử dụng",
      className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    },
    RESERVED: {
      variant: "secondary" as const,
      label: "Đã đặt trước",
      className: "bg-gray-100 text-orange-700 hover:bg-orange-100",
    },
    REPAIRING: {
      variant: "outline" as const,
      label: "Đang sửa chữa",
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    },
    UNAVAILABLE: {
      variant: "destructive" as const,
      label: "Không khả dụng",
      className: "bg-red-100 text-red-700 hover:bg-red-100",
    },
  };
  return statusMap[status as keyof typeof statusMap] || statusMap.AVAILABLE;
};

export function CarTable({ cars, loading, onView, onEdit }: CarTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border-0 shadow-sm p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-lg border-0 shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">Không tìm thấy xe nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-0 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">
              Biển số xe
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Mẫu xe
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Sức khỏe pin
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Trạng thái
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => {
            const statusInfo = getStatusBadge(car.status);
            return (
              <TableRow key={car.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {car.licensePlate}
                </TableCell>
                <TableCell className="text-gray-600">
                  {car.model?.modelName || "N/A"}
                </TableCell>
                <TableCell className="text-gray-600">
                  {car.batteryHealthPercentage}%
                </TableCell>
                <TableCell>
                  <Badge className={statusInfo.className}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(car)}
                      className="hover:bg-emerald-50 hover:text-emerald-600"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(car)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                      title="Cập nhật"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
