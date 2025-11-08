import React from "react";
import type { Amenity } from "@/@types/car/amentities";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";

interface AmenityTableProps {
  data: Amenity[];
  onEdit: (item: Amenity) => void;
  onDelete: (item: Amenity) => void;
}

const AmenityTable: React.FC<AmenityTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Tên tiện ích</TableHead>
            <TableHead>Biểu tượng (URL/Tên)</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Cập nhật</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.icon ? String(item.icon) : "-"}</TableCell>
              <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</TableCell>
              <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}</TableCell>
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


