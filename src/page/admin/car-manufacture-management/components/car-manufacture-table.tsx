import React from "react";
import type { CarManufacture } from "@/@types/car/carManufacture";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";

interface CarManufactureTableProps {
  data: CarManufacture[];
  onEdit: (item: CarManufacture) => void;
  onDelete: (item: CarManufacture) => void;
}

const CarManufactureTable: React.FC<CarManufactureTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Tên nhà sản xuất xe</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày cập nhật</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                {item.logo ? (
                  <img src={item.logo} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-muted-foreground">No logo</span>
                )}
              </TableCell>
              <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</TableCell>
              <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}</TableCell>
              <TableCell>
                <Badge variant={!item.isDeleted ? "soft-green" : "soft-gray"} className="whitespace-nowrap">
                  {!item.isDeleted ? "Hoạt động" : "Không hoạt động"}
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

export default CarManufactureTable;

