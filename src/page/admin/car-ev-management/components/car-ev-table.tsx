import React from "react";
import type { CarEV } from "@/@types/car/carEv";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import type { CarEvStatus } from "@/@types/enum";
import { formatDate } from "@/lib/utils/formatDate";

interface CarEVTableProps {
  data: CarEV[];
  onEdit: (item: CarEV) => void;
  onDelete: (item: CarEV) => void;
}

const statusOptions: Array<{ value: CarEvStatus; label: string; color: string }> = [
  { value: "AVAILABLE", label: "Có sẵn", color: "bg-green-100 text-green-800" },
  { value: "UNAVAILABLE", label: "Không có sẵn", color: "bg-red-100 text-red-800" },
  { value: "RESERVED", label: "Đã đặt", color: "bg-yellow-100 text-yellow-800" },
  { value: "IN_USE", label: "Đang sử dụng", color: "bg-blue-100 text-blue-800" },
  { value: "REPAIRING", label: "Đang sửa chữa", color: "bg-orange-100 text-orange-800" },
];

const CarEVTable: React.FC<CarEVTableProps> = ({ data, onEdit, onDelete }) => {
  const getStatusBadge = (status: CarEvStatus) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <Badge className={`whitespace-nowrap ${statusOption?.color || "bg-gray-100 text-gray-800"}`}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-[180px] whitespace-nowrap text-[#065F46]">Hình ảnh</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Biển số xe</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Model</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạm xe điện</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tình trạng pin (%)</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày cập nhật</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
            <TableHead className="w-[100px] text-right whitespace-nowrap text-[#065F46]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.model?.image ? (
                  <img
                    src={item.model.image}
                    alt={item.model.modelName || "Model image"}
                    className="w-40 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-40 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    Không có ảnh
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">{item.licensePlate}</TableCell>
              <TableCell className="whitespace-nowrap">{item.model?.modelName || "N/A"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.depot?.name || "N/A"}</TableCell>
              <TableCell className="whitespace-nowrap">{item.batteryHealthPercentage}%</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.updatedAt ? formatDate(item.updatedAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CarEVTable;

