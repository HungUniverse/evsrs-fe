import React, { useState } from "react";
import type { Depot } from "@/@types/car/depot";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RowActions from "./row-actions";
import { formatDate } from "@/lib/utils/formatDate";
import { AIIcon } from "@/components/ui/ai-icon";
import ForecastDialog from "./forecast-dialog";

interface DepotTableProps {
  data: Depot[];
  onEdit: (item: Depot) => void;
  onDelete: (item: Depot) => void;
  startIndex?: number;
}

const DepotTable: React.FC<DepotTableProps> = ({ data, onEdit, onDelete, startIndex = 1 }) => {
  const [forecastDialog, setForecastDialog] = useState<{
    open: boolean;
    depotId: string;
    depotName: string;
  }>({
    open: false,
    depotId: "",
    depotName: "",
  });

  const openForecast = (depot: Depot) => {
    setForecastDialog({
      open: true,
      depotId: depot.id,
      depotName: depot.name,
    });
  };

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
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-16 whitespace-nowrap text-[#065F46] text-center sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              STT
            </TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Tên trạm</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tỉnh/Thành phố</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Quận/Huyện</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Phường/Xã</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Đường</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Giờ mở cửa</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Giờ đóng cửa</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
            <TableHead className="text-center whitespace-nowrap text-[#065F46]">Gợi ý AI</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46] sticky right-0 bg-[#D1FAE5] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors group">
              <TableCell className="whitespace-nowrap text-center sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors w-16 text-muted-foreground">
                {startIndex + index}
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap sticky left-16 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
                {item.name}
              </TableCell>
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
              <TableCell className="text-center whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openForecast(item)}
                  className="hover:bg-purple-50 dark:hover:bg-purple-950/20"
                >
                  <AIIcon size={20} />
                </Button>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
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

      <ForecastDialog
        open={forecastDialog.open}
        onOpenChange={(open) =>
          setForecastDialog((prev) => ({ ...prev, open }))
        }
        depotId={forecastDialog.depotId}
        depotName={forecastDialog.depotName}
      />
    </div>
  );
};

export default DepotTable;

