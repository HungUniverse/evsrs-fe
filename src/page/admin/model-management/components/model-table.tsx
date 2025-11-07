import React from "react";
import type { Model } from "@/@types/car/model";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import type { CarManufacture } from "@/@types/car/carManufacture";
import type { Amenity } from "@/@types/car/amentities";

interface ModelTableProps {
  data: Model[];
  manufacturers: CarManufacture[];
  amenities: Amenity[];
  onEdit: (item: Model) => void;
  onDelete: (item: Model) => void;
}

const ModelTable: React.FC<ModelTableProps> = ({ data, manufacturers, amenities, onEdit, onDelete }) => {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Hình ảnh</TableHead>
            <TableHead className="w-[15%]">Tên model</TableHead>
            <TableHead>Nhà sản xuất</TableHead>
            <TableHead>Tiện nghi</TableHead>
            <TableHead>Dung lượng pin (kWh)</TableHead>
            <TableHead>Tầm hoạt động (km)</TableHead>
            <TableHead>Số ghế</TableHead>
            <TableHead>Giá thuê</TableHead>
            <TableHead>Giảm giá (%)</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.image ? (
                  <img src={item.image} alt="Model" className="w-40 h-48 object-cover rounded-lg" />
                ) : (
                  <span className="text-muted-foreground text-sm">No image</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.modelName}</TableCell>
              <TableCell>{getManufacturerName(item.manufacturerCarId)}</TableCell>
              <TableCell>{getAmenityName(item.amenitiesId)}</TableCell>
              <TableCell>{item.batteryCapacityKwh}</TableCell>
              <TableCell>{item.rangeKm}</TableCell>
              <TableCell>{item.seats}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>{item.sale}%</TableCell>
              <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</TableCell>
              <TableCell>
                <Badge variant={!item.isDeleted ? "soft-green" : "soft-gray"} className="whitespace-nowrap">
                  {!item.isDeleted ? "Hoạt động" : "Đã xóa"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-sm text-muted-foreground py-8">
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

