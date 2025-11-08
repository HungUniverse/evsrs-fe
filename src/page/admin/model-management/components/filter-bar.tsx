import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, ArrowUpDown, Factory } from "lucide-react";
import type { SortValue } from "@/hooks/use-model-table-state";
import type { CarManufacture } from "@/@types/car/carManufacture";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
  manufacturerCarId: string;
  onManufacturerChange: (v: string) => void;
  manufacturers: CarManufacture[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  manufacturerCarId,
  onManufacturerChange,
  manufacturers,
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
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm theo tên model"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer-filter" className="text-sm font-medium flex items-center gap-2">
                <Factory className="h-3.5 w-3.5 text-muted-foreground" />
                Nhà sản xuất
              </Label>
              <Select value={manufacturerCarId || "all"} onValueChange={(v) => onManufacturerChange(v === "all" ? "" : v)}>
                <SelectTrigger id="manufacturer-filter" className="h-10">
                  <SelectValue placeholder="Chọn nhà sản xuất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhà sản xuất</SelectItem>
                  {manufacturers.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-sort-filter" className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                Sắp xếp
              </Label>
              <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
                <SelectTrigger id="model-sort-filter" className="h-10">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                  <SelectItem value="range-asc">Tầm hoạt động (thấp đến cao)</SelectItem>
                  <SelectItem value="range-desc">Tầm hoạt động (cao đến thấp)</SelectItem>
                  <SelectItem value="created-desc">Ngày tạo (mới nhất)</SelectItem>
                  <SelectItem value="created-asc">Ngày tạo (cũ nhất)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;

