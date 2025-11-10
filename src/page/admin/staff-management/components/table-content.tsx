import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { StaffTableRow } from "./staff-row";

interface StaffTableContentProps {
  rows: UserFull[];
  selected: Record<string, boolean>;
  onToggleSelect: (userId: string, value: boolean) => void;
  expandedRow: string | null;
  onToggleExpand: (userId: string) => void;
  getDepotName: (depotId: string | undefined) => string;
  depotMap: Record<string, Depot>;
  onChangeDepot: (user: UserFull) => void;
  onRequestDelete: (user: UserFull) => void;
}

export function StaffTableContent({
  rows,
  selected,
  onToggleSelect,
  expandedRow,
  onToggleExpand,
  getDepotName,
  depotMap,
  onChangeDepot,
  onRequestDelete,
}: StaffTableContentProps) {
  const hasData = rows.length > 0;

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-[40px] text-[#065F46]" />
            <TableHead className="whitespace-nowrap text-[#065F46]">Nhân viên</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Số điện thoại / Email</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ngày cập nhật</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạm</TableHead>
            <TableHead className="w-[70px] text-right whitespace-nowrap text-[#065F46]">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasData ? (
            rows.map((user) => (
              <StaffTableRow
                key={user.id}
                user={user}
                isSelected={Boolean(selected[user.id])}
                onSelectChange={(value) => onToggleSelect(user.id, value)}
                isExpanded={expandedRow === user.id}
                onToggleExpand={() => onToggleExpand(user.id)}
                getDepotName={getDepotName}
                depotMap={depotMap}
                onChangeDepot={onChangeDepot}
                onRequestDelete={onRequestDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="py-12">
                <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                  <Users className="size-8" />
                  <div>
                    <p className="text-sm font-semibold">Chưa có nhân viên nào</p>
                    <p className="text-xs">Hãy thêm nhân viên mới để bắt đầu quản lý.</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

