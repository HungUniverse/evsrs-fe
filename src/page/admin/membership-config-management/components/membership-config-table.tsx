import React from "react";
import type { MembershipLevel } from "@/@types/membership";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RowActions from "./row-actions";
import { Award } from "lucide-react";
import { vnd } from "@/lib/utils/currency";

interface MembershipConfigTableProps {
  data: MembershipLevel[];
  onEdit: (item: MembershipLevel) => void;
  onDelete: (item: MembershipLevel) => void;
}

const getLevelBadgeProps = (level: string) => {
  const normalized = level.toUpperCase();

  switch (normalized) {
    case "BRONZE":
      return {
        variant: "outline" as const,
        className: "border-none bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-white shadow-sm",
      };
    case "SILVER":
      return {
        variant: "outline" as const,
        className: "border-none bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600 text-white shadow-sm",
      };
    case "GOLD":
      return {
        variant: "outline" as const,
        className: "border-none bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-white shadow-sm",
      };
    case "NONE":
      return {
        variant: "outline" as const,
        className: "border-dashed border-muted-foreground/40 text-muted-foreground bg-muted",
      };
    default:
      return {
        variant: "outline" as const,
        className:
          "border-none bg-gradient-to-r from-primary/80 via-primary to-primary/90 text-primary-foreground shadow-sm",
      };
  }
};

const MembershipConfigTable: React.FC<MembershipConfigTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hạng</TableHead>
            <TableHead>Tên hạng</TableHead>
            <TableHead>Mức giảm giá</TableHead>
            <TableHead>Số tiền yêu cầu</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày cập nhật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const badgeProps = getLevelBadgeProps(item.level);

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  <Badge variant={badgeProps.variant} className={cn("capitalize", badgeProps.className)}>
                    <Award className="h-3 w-3 mr-1" />
                    {item.level}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{item.levelName}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-semibold text-green-600">{item.discountPercent}%</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-medium">{vnd(item.requiredAmount)} VNĐ</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : ""}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : ""}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembershipConfigTable;

