import React from "react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";

interface SystemConfigTableProps {
  data: SystemConfigTypeResponse[];
  onEdit: (item: SystemConfigTypeResponse) => void;
  onDelete: (item: SystemConfigTypeResponse) => void;
}

const SystemConfigTable: React.FC<SystemConfigTableProps> = ({ data, onEdit, onDelete }) => {
  const getConfigTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "General":
        return "default";
      case "PaymentGateway":
        return "secondary";
      case "Notification":
        return "outline";
      case "Security":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Key</TableHead>
            <TableHead className="w-[30%]">Value</TableHead>
            <TableHead className="w-[15%]">Loại</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Cập nhật</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.key}</TableCell>
              <TableCell className="max-w-md truncate" title={item.value}>
                {item.value}
              </TableCell>
              <TableCell>
                <Badge variant={getConfigTypeBadgeVariant(item.configType)}>
                  {item.configType}
                </Badge>
              </TableCell>
              <TableCell>
                {item.createAt ? new Date(item.createAt).toLocaleString("vi-VN") : "-"}
              </TableCell>
              <TableCell>
                {item.updatedAt ? new Date(item.updatedAt).toLocaleString("vi-VN") : "-"}
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

export default SystemConfigTable;

