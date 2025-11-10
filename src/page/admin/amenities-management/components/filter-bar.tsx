import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Plus } from "lucide-react";
import type { SortValue } from "@/hooks/use-amenities-table-state";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
  onAddClick: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ search, onSearchChange, sort, onSortChange, onAddClick }) => {
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
            <div className="flex-1 min-w-[200px] max-w-[300px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tên tiện nghi"
                  className="pl-8 h-9 bg-background text-sm"
                />
              </div>
            </div>

            {/* Sort Select */}
            <div className="flex-1 min-w-[180px] max-w-[220px]">
              <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Ngày tạo (mới nhất)" />
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

          {/* Add Button - Right Side */}
          <Button onClick={onAddClick} className="h-9 shrink-0 text-sm ml-auto bg-emerald-200 text-emerald-900 hover:bg-emerald-300">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Thêm tiện nghi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;


