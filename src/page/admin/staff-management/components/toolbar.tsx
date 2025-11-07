import { ArrowUpDown, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortState } from "../hooks/use-staff-table";

interface StaffTableToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  sortState: SortState;
  onSortChange: (sort: SortState) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenCreate: () => void;
  selectedCount: number;
  isAnySelected: boolean;
  onDeleteSelected: () => void;
}

const SORT_OPTIONS: Array<{ label: string; value: SortState }> = [
  { label: "Tên A→Z", value: { field: "fullName", direction: "asc" } },
  { label: "Tên Z→A", value: { field: "fullName", direction: "desc" } },
  { label: "Ngày tạo (mới nhất)", value: { field: "createdAt", direction: "desc" } },
  { label: "Ngày tạo (cũ nhất)", value: { field: "createdAt", direction: "asc" } },
];

export function StaffTableToolbar({
  query,
  onQueryChange,
  sortState,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  onOpenCreate,
  selectedCount,
  isAnySelected,
  onDeleteSelected,
}: StaffTableToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm nhanh (tên / tên đăng nhập / số điện thoại / email)"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="w-[280px] sm:w-[320px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <Label htmlFor="staff-sort-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Sắp xếp:
            </Label>
            <Select
              value={`${sortState.field}-${sortState.direction}`}
              onValueChange={(value) => {
                const [field, direction] = value.split("-") as [SortState["field"], SortState["direction"]];
                onSortChange({ field, direction });
              }}
            >
              <SelectTrigger id="staff-sort-filter" className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={`${option.value.field}-${option.value.direction}`}
                    value={`${option.value.field}-${option.value.direction}`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onOpenCreate} className="flex items-center gap-2" size="sm">
            <Plus className="size-4" />
            Thêm nhân viên
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50"
            >
              <RotateCcw className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
              Đặt lại bộ lọc
            </Button>
          )}

          {isAnySelected && (
            <Button variant="destructive" size="sm" onClick={onDeleteSelected} className="flex items-center gap-2">
              <Trash2 className="size-4" />
              Xóa đã chọn ({selectedCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

