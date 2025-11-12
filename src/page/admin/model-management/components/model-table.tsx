import React from "react";
import type { Model } from "@/@types/car/model";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import type { CarManufacture } from "@/@types/car/carManufacture";
import type { Amenity } from "@/@types/car/amentities";
import { formatDate } from "@/lib/utils/formatDate";
import { useCarCountByModel } from "../hooks/use-car-count-by-model";
import { Car } from "lucide-react";

interface ModelTableProps {
  data: Model[];
  manufacturers: CarManufacture[];
  amenities: Amenity[];
  onEdit: (item: Model) => void;
  onDelete: (item: Model) => void;
  depotId?: string;
  startIndex?: number;
}

const ModelTable: React.FC<ModelTableProps> = ({ data, manufacturers, amenities, onEdit, onDelete, depotId, startIndex = 1 }) => {
  const { getCarCount, loading: loadingCounts } = useCarCountByModel({ depotId });
  
  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(value) || 0);
  };

  const getManufacturerName = (id: unknown) => {
    const manufacturer = manufacturers.find(m => m.id === id);
    return manufacturer?.name || "Unknown";
  };

  const getAmenityName = (id: unknown) => {
    const amenity = amenities.find(a => a.id === id);
    return amenity?.name || "Unknown";
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead
              className="whitespace-nowrap text-[#065F46] text-center sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10"
              style={{ width: "64px", minWidth: "64px" }}
            >
              STT
            </TableHead>
            <TableHead
              className="whitespace-nowrap text-[#065F46] sticky bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10"
              style={{ width: "220px", minWidth: "220px", left: "64px" }}
            >
              Hình ảnh
            </TableHead>
            <TableHead
              className="w-[15%] whitespace-nowrap text-[#065F46] sticky bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10"
              style={{ left: "284px" }}
            >
              Tên model
            </TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Nhà sản xuất</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tiện nghi</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Dung lượng pin (kWh)</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tầm hoạt động (km)</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Số ghế</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Giá thuê</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Giảm giá (%)</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Số lượng xe</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46] sticky right-0 bg-[#D1FAE5] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors group">
              <TableCell
                className="text-center sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors text-muted-foreground"
                style={{ width: "64px", minWidth: "64px" }}
              >
                {startIndex + index}
              </TableCell>
              <TableCell
                className="sticky bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors"
                style={{ width: "220px", minWidth: "220px", left: "64px", padding: "1rem" }}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt="Model" 
                    style={{ width: '200px', height: '80px', objectFit: 'cover', display: 'block' }}
                    className="rounded-lg" 
                  />
                ) : (
                  <div style={{ width: '200px', height: '80px' }} className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </TableCell>
              <TableCell
                className="font-medium whitespace-nowrap sticky bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors"
                style={{ left: "284px" }}
              >
                {item.modelName}
              </TableCell>
              <TableCell className="whitespace-nowrap">{getManufacturerName(item.manufacturerCarId)}</TableCell>
              <TableCell className="whitespace-nowrap">{getAmenityName(item.amenitiesId)}</TableCell>
              <TableCell className="whitespace-nowrap">{item.batteryCapacityKwh}</TableCell>
              <TableCell className="whitespace-nowrap">{item.rangeKm}</TableCell>
              <TableCell className="whitespace-nowrap">{item.seats}</TableCell>
              <TableCell className="whitespace-nowrap">{formatCurrency(item.price)}</TableCell>
              <TableCell className="whitespace-nowrap">{item.sale}%</TableCell>
              <TableCell className="whitespace-nowrap">
                {loadingCounts ? (
                  <span className="text-muted-foreground">...</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-600">{getCarCount(item.id)}</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={!item.isDeleted ? "soft-green" : "soft-gray"} className="whitespace-nowrap">
                  {!item.isDeleted ? "Hoạt động" : "Đã xóa"}
                </Badge>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
                <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={14} className="text-center text-sm text-muted-foreground py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelTable;

