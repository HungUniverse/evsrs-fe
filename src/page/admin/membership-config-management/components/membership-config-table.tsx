import React from "react";
import type { MembershipLevel } from "@/@types/membership";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RowActions from "./row-actions";
import { Award } from "lucide-react";
import { vnd } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/formatDate";
import { getLevelBadgeProps, getLevelDisplayName } from "../utils/level";

interface MembershipConfigTableProps {
  data: MembershipLevel[];
  onEdit: (item: MembershipLevel) => void;
  startIndex?: number;
}

const MembershipConfigTable: React.FC<MembershipConfigTableProps> = ({ data, onEdit, startIndex = 1 }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-16 whitespace-nowrap text-[#065F46] text-center sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              STT
            </TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              Hạng
            </TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tên hạng</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Mức giảm giá</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Số tiền yêu cầu</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày cập nhật</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46] sticky right-0 bg-[#D1FAE5] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const badgeProps = getLevelBadgeProps(item.level);

            return (
              <TableRow key={item.id} className="hover:bg-muted/50 transition-colors group">
                <TableCell className="whitespace-nowrap text-center sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors w-16 text-muted-foreground">
                  {startIndex + index}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap sticky left-16 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
                  <Badge variant={badgeProps.variant} className={cn("whitespace-nowrap capitalize", badgeProps.className)}>
                    <Award className="h-3 w-3 mr-1" />
                    {getLevelDisplayName(item.level)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{item.levelName || getLevelDisplayName(item.level)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-semibold text-green-600">{item.discountPercent}%</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-medium">{vnd(item.requiredAmount)} VNĐ</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.updatedAt ? formatDate(item.updatedAt) : ""}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
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

