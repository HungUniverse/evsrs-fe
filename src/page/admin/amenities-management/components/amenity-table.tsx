import React from "react";
import type { Amenity } from "@/@types/car/amentities";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import { formatDate } from "@/lib/utils/formatDate";

interface AmenityTableProps {
  data: Amenity[];
  onEdit: (item: Amenity) => void;
  onDelete: (item: Amenity) => void;
}

const AmenityTable: React.FC<AmenityTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-[40%] whitespace-nowrap text-[#065F46]">Tên tiện nghi</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Biểu tượng (URL/Tên)</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Cập nhật</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium whitespace-nowrap">{item.name}</TableCell>
              <TableCell className="whitespace-nowrap">{item.icon ? String(item.icon) : "-"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.updatedAt ? formatDate(item.updatedAt) : ""}
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
              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AmenityTable;


