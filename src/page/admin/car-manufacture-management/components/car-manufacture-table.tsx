import React from "react";
import type { CarManufacture } from "@/@types/car/carManufacture";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import { formatDate } from "@/lib/utils/formatDate";

interface CarManufactureTableProps {
  data: CarManufacture[];
  onEdit: (item: CarManufacture) => void;
  onDelete: (item: CarManufacture) => void;
  startIndex?: number;
}

const CarManufactureTable: React.FC<CarManufactureTableProps> = ({ data, onEdit, onDelete, startIndex = 1 }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-16 whitespace-nowrap text-[#065F46] text-center sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              STT
            </TableHead>
            <TableHead className="w-[30%] whitespace-nowrap text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              Tên nhà sản xuất xe
            </TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Logo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày cập nhật</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
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
              <TableCell className="whitespace-nowrap">
                {item.logo ? (
                  <img src={item.logo} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-muted-foreground">No logo</span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.createdAt ? formatDate(item.createdAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.updatedAt ? formatDate(item.updatedAt) : ""}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={!item.isDeleted ? "soft-green" : "soft-gray"} className="whitespace-nowrap">
                  {!item.isDeleted ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
                <RowActions item={item} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
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

export default CarManufactureTable;

