import { Plus, RotateCcw, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <Card className="shadow-sm border bg-muted/30 rounded-lg">
      <CardContent className="p-4">
        {/* Header with Filter Icon and Title */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-foreground" />
          <span className="text-sm font-semibold text-foreground">Bộ lọc tìm kiếm</span>
        </div>

        {/* Horizontal Filters Row - Compact Layout */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filters Section - Left Side */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px] max-w-[400px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Tìm nhanh (tên / tên đăng nhập / số điện thoại / email)"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                  className="pl-8 h-9 bg-background text-sm"
                />
              </div>
            </div>

            {/* Sort Select */}
            <div className="flex-1 min-w-[160px] max-w-[220px]">
              <Select
                value={`${sortState.field}-${sortState.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-") as [SortState["field"], SortState["direction"]];
                  onSortChange({ field, direction });
                }}
              >
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Tên A→Z" />
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

            {/* Delete Selected Button */}
            {isAnySelected && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onDeleteSelected} 
                className="h-9 shrink-0 text-sm"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Xóa ({selectedCount})
              </Button>
            )}

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
                className="h-9 px-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 text-sm"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Đặt lại
              </Button>
            )}
          </div>

          {/* Add Staff Button - Right Side */}
          <Button onClick={onOpenCreate} className="h-9 shrink-0 text-sm ml-auto">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Thêm nhân viên
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
