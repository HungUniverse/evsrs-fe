import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortValue } from "@/hooks/use-amenities-table-state";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ search, onSearchChange, sort, onSortChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex-1 flex items-center gap-3">
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Tìm theo tên tiện ích" />
        <div className="w-[220px]">
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Tên A-Z</SelectItem>
              <SelectItem value="name-desc">Tên Z-A</SelectItem>
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


