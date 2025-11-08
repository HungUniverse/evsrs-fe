import { ArrowUpDown, Plus, RotateCcw, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="shadow-sm border">
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm nhanh (tên / tên đăng nhập / số điện thoại / email)"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                className="pl-10 pr-4 h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={onOpenCreate} className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân viên
            </Button>
            {isAnySelected && (
              <Button variant="destructive" size="sm" onClick={onDeleteSelected} className="h-10">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa đã chọn ({selectedCount})
              </Button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff-sort-filter" className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                Sắp xếp
              </Label>
              <Select
                value={`${sortState.field}-${sortState.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-") as [SortState["field"], SortState["direction"]];
                  onSortChange({ field, direction });
                }}
              >
                <SelectTrigger id="staff-sort-filter" className="h-10">
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

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2">
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
                className="h-9 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                Đặt lại bộ lọc
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

