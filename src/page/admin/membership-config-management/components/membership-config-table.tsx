import React from "react";
import type { MembershipLevel } from "@/@types/membership";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RowActions from "./row-actions";
import { Award } from "lucide-react";
import { vnd } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/formatDate";

interface MembershipConfigTableProps {
  data: MembershipLevel[];
  onEdit: (item: MembershipLevel) => void;
}

// Translate level to Vietnamese
const translateLevel = (level: string): string => {
  const normalized = level.toUpperCase();
  switch (normalized) {
    case "BRONZE":
      return "Đồng";
    case "SILVER":
      return "Bạc";
    case "GOLD":
      return "Vàng";
    case "NONE":
      return "Không có";
    default:
      return level;
  }
};

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

const MembershipConfigTable: React.FC<MembershipConfigTableProps> = ({ data, onEdit }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="whitespace-nowrap text-[#065F46]">Hạng</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tên hạng</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Mức giảm giá</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Số tiền yêu cầu</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày cập nhật</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const badgeProps = getLevelBadgeProps(item.level);

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  <Badge variant={badgeProps.variant} className={cn("whitespace-nowrap capitalize", badgeProps.className)}>
                    <Award className="h-3 w-3 mr-1" />
                    {translateLevel(item.level)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{item.levelName || translateLevel(item.level)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-semibold text-green-600">{item.discountPercent}%</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-medium">{vnd(item.requiredAmount)} VNĐ</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.createdAt ? formatDate(item.createdAt) : ""}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.updatedAt ? formatDate(item.updatedAt) : ""}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <RowActions item={item} onEdit={onEdit} />
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

