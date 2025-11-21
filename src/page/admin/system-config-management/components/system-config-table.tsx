import React from "react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RowActions from "./row-actions";
import { formatDate } from "@/lib/utils/formatDate";

interface SystemConfigTableProps {
  data: SystemConfigTypeResponse[];
  onEdit: (item: SystemConfigTypeResponse) => void;
  startIndex?: number;
}

const SystemConfigTable: React.FC<SystemConfigTableProps> = ({ data, onEdit, startIndex = 1 }) => {

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-16 whitespace-nowrap text-[#065F46] text-center sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              STT
            </TableHead>
            <TableHead className="w-[20%] whitespace-nowrap text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              Key
            </TableHead>
            <TableHead className="w-[30%] whitespace-nowrap text-[#065F46]">Value</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Cập nhật</TableHead>
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
                <code className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-mono text-sm border border-slate-200">
                  {item.key}
                </code>
              </TableCell>
              <TableCell className="max-w-md truncate whitespace-nowrap" title={item.value}>
                {item.value}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {item.updatedAt ? formatDate(item.updatedAt) : "-"}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
                <RowActions item={item} onEdit={onEdit} />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
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

