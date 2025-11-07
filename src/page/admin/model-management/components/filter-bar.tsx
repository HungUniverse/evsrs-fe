import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex-1 flex items-center gap-3 flex-wrap">
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Tìm theo tên model" className="flex-1 min-w-[200px]" />
        <div className="w-[220px]">
          <Select value={manufacturerCarId || "all"} onValueChange={(v) => onManufacturerChange(v === "all" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo nhà sản xuất" />
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
        <div className="w-[220px]">
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
            <SelectTrigger>
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
  );
};

export default FilterBar;

