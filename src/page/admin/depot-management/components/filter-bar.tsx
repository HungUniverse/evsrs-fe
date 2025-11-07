import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
}) => {
  return (
    <div className="space-y-4">
      {/* Search Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên trạm..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter and Sort Row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-1">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </TooltipTrigger>
            <TooltipContent>Bộ lọc</TooltipContent>
          </Tooltip>

          {/* Province Filter */}
          <div className="w-[200px]">
            <Input
              placeholder="Lọc theo tỉnh/thành phố"
              value={province}
              onChange={(e) => onProvinceChange(e.target.value)}
            />
          </div>

          {/* District Filter */}
          <div className="w-[200px]">
            <Input
              placeholder="Lọc theo quận/huyện"
              value={district}
              onChange={(e) => onDistrictChange(e.target.value)}
            />
          </div>

          {/* Ward Filter */}
          <div className="w-[200px]">
            <Input
              placeholder="Lọc theo phường/xã"
              value={ward}
              onChange={(e) => onWardChange(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sắp xếp theo..." />
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

          {/* Clear Filters Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50 sm:ml-auto"
              >
                <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Đặt lại bộ lọc</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

