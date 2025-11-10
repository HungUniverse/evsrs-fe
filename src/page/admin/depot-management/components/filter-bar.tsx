import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, RotateCcw, Plus } from "lucide-react";
import type { SortValue } from "@/hooks/use-depot-table-state";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
  province: string;
  onProvinceChange: (v: string) => void;
  district: string;
  onDistrictChange: (v: string) => void;
  ward: string;
  onWardChange: (v: string) => void;
  onClearFilters: () => void;
  onAdd: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  province,
  onProvinceChange,
  district,
  onDistrictChange,
  ward,
  onWardChange,
  onClearFilters,
  onAdd,
}) => {
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
            <div className="flex-1 min-w-[150px] max-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Tên trạm"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-8 h-9 bg-background text-sm"
                />
              </div>
            </div>

            {/* Province Input */}
            <div className="flex-1 min-w-[120px] max-w-[160px]">
              <Input
                placeholder="Tỉnh/Thành phố"
                value={province}
                onChange={(e) => onProvinceChange(e.target.value)}
                className="h-9 bg-background text-sm"
              />
            </div>

            {/* District Input */}
            <div className="flex-1 min-w-[120px] max-w-[160px]">
              <Input
                placeholder="Quận/Huyện"
                value={district}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="h-9 bg-background text-sm"
              />
            </div>

            {/* Ward Input */}
            <div className="flex-1 min-w-[120px] max-w-[160px]">
              <Input
                placeholder="Phường/Xã"
                value={ward}
                onChange={(e) => onWardChange(e.target.value)}
                className="h-9 bg-background text-sm"
              />
            </div>

            {/* Sort Select */}
            <div className="flex-1 min-w-[150px] max-w-[180px]">
              <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Ngày tạo (mới nhất)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Tên trạm (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Tên trạm (Z-A)</SelectItem>
                  <SelectItem value="province-asc">Tỉnh/Thành phố (A-Z)</SelectItem>
                  <SelectItem value="province-desc">Tỉnh/Thành phố (Z-A)</SelectItem>
                  <SelectItem value="district-asc">Quận/Huyện (A-Z)</SelectItem>
                  <SelectItem value="district-desc">Quận/Huyện (Z-A)</SelectItem>
                  <SelectItem value="openTime-asc">Giờ mở cửa (sớm nhất)</SelectItem>
                  <SelectItem value="openTime-desc">Giờ mở cửa (muộn nhất)</SelectItem>
                  <SelectItem value="created-desc">Ngày tạo (mới nhất)</SelectItem>
                  <SelectItem value="created-asc">Ngày tạo (cũ nhất)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="h-9 px-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 text-sm"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Đặt lại
            </Button>
          </div>

          {/* Add Button - Right Side */}
          <Button onClick={onAdd} className="h-9 shrink-0 text-sm ml-auto bg-emerald-200 text-emerald-900 hover:bg-emerald-300">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Thêm trạm mới
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
