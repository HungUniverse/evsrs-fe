import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, ArrowUpDown, RotateCcw, MapPin } from "lucide-react";
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
    <Card className="shadow-sm border">
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên trạm..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 h-10"
              />
            </div>
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

          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province-filter" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Tỉnh/Thành phố
              </Label>
              <Input
                id="province-filter"
                placeholder="Nhập tỉnh/thành phố"
                value={province}
                onChange={(e) => onProvinceChange(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district-filter" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Quận/Huyện
              </Label>
              <Input
                id="district-filter"
                placeholder="Nhập quận/huyện"
                value={district}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward-filter" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Phường/Xã
              </Label>
              <Input
                id="ward-filter"
                placeholder="Nhập phường/xã"
                value={ward}
                onChange={(e) => onWardChange(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort-filter" className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                Sắp xếp
              </Label>
              <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
                <SelectTrigger id="sort-filter" className="h-10">
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
          </div>

          {/* Reset Button */}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;

