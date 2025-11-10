import React from "react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RowActions from "./row-actions";
import { formatDate } from "@/lib/utils/formatDate";

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
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-[20%] whitespace-nowrap text-[#065F46]">Key</TableHead>
            <TableHead className="w-[30%] whitespace-nowrap text-[#065F46]">Value</TableHead>
            <TableHead className="w-[15%] whitespace-nowrap text-[#065F46]">Loại</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Cập nhật</TableHead>
            <TableHead className="text-right whitespace-nowrap text-[#065F46]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium whitespace-nowrap">{item.key}</TableCell>
              <TableCell className="max-w-md truncate whitespace-nowrap" title={item.value}>
                {item.value}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={getConfigTypeBadgeVariant(item.configType)} className="whitespace-nowrap">
                  {item.configType}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.createAt ? formatDate(item.createAt) : "-"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.updatedAt ? formatDate(item.updatedAt) : "-"}
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

export default SystemConfigTable;

