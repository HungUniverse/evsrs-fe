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
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap" style={{ width: '220px', minWidth: '220px' }}>Hình ảnh</TableHead>
            <TableHead className="w-[15%] whitespace-nowrap">Tên model</TableHead>
            <TableHead className="whitespace-nowrap">Nhà sản xuất</TableHead>
            <TableHead className="whitespace-nowrap">Tiện nghi</TableHead>
            <TableHead className="whitespace-nowrap">Dung lượng pin (kWh)</TableHead>
            <TableHead className="whitespace-nowrap">Tầm hoạt động (km)</TableHead>
            <TableHead className="whitespace-nowrap">Số ghế</TableHead>
            <TableHead className="whitespace-nowrap">Giá thuê</TableHead>
            <TableHead className="whitespace-nowrap">Giảm giá (%)</TableHead>
            <TableHead className="whitespace-nowrap">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
            <TableHead className="text-right whitespace-nowrap">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell style={{ width: '220px', minWidth: '220px', padding: '1rem' }}>
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

