import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SortValue = "name-asc" | "name-desc" | "created-desc" | "created-asc";

interface AmenitiesToolbarProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  sortValue: SortValue;
  onSortValueChange: (value: SortValue) => void;
  onAddClick: () => void;
}

const AmenitiesToolbar: React.FC<AmenitiesToolbarProps> = ({
  searchText,
  onSearchTextChange,
  sortValue,
  onSortValueChange,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex-1 flex items-center gap-3">
        <Input
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Tìm theo tên tiện ích"
        />
        <div className="w-[220px]">
          <Select value={sortValue} onValueChange={(v) => onSortValueChange(v as SortValue)}>
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
      <div className="flex justify-end">
        <Button onClick={onAddClick}>Thêm tiện ích</Button>
      </div>
    </div>
  );
};

export default AmenitiesToolbar;


