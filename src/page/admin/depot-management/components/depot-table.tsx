import React from "react";
import type { Depot } from "@/@types/car/depot";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import { formatDate } from "@/lib/utils/formatDate";

interface DepotTableProps {
  data: Depot[];
  onEdit: (item: Depot) => void;
  onDelete: (item: Depot) => void;
}

const DepotTable: React.FC<DepotTableProps> = ({ data, onEdit, onDelete }) => {
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    try {
      // If it's a datetime string, parse and format
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Ho_Chi_Minh",
          hour12: true,
        });
      }
      // If it's just a time string (HH:mm:ss or HH:mm), extract HH:mm
      const timeOnly = timeString.includes("T") 
        ? timeString.split("T")[1]?.split(".")[0] 
        : timeString;
      // Convert 24h to 12h format if needed
      const [hours, minutes] = timeOnly.split(":");
      if (hours && minutes) {
        const hour24 = parseInt(hours, 10);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 >= 12 ? "PM" : "AM";
        return `${hour12.toString().padStart(2, "0")}:${minutes.substring(0, 2)} ${ampm}`;
      }
      return timeOnly.substring(0, 5);
    } catch {
      // Fallback: just take first 5 characters
      return timeString.substring(0, 5);
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tên trạm</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tỉnh/Thành phố</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Quận/Huyện</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Phường/Xã</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Đường</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Giờ mở cửa</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Giờ đóng cửa</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium whitespace-nowrap">{item.name}</TableCell>
              <TableCell className="whitespace-nowrap">{item.province}</TableCell>
              <TableCell className="whitespace-nowrap">{item.district}</TableCell>
              <TableCell className="whitespace-nowrap">{item.ward}</TableCell>
              <TableCell className="whitespace-nowrap">{item.street}</TableCell>
              <TableCell className="whitespace-nowrap">{formatTime(item.openTime)}</TableCell>
              <TableCell className="whitespace-nowrap">{formatTime(item.closeTime)}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={!item.isDeleted ? "soft-green" : "soft-gray"} className="whitespace-nowrap">
                  {!item.isDeleted ? "Hoạt động" : "Đã xóa"}
                </Badge>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepotTable;

