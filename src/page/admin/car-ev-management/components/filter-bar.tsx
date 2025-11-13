import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, RotateCcw, Plus } from "lucide-react";
import type { SortValue } from "../hooks/use-car-ev-table-state";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import type { CarEvStatus } from "@/@types/enum";

const statusOptions: Array<{ value: CarEvStatus; label: string }> = [
  { value: "AVAILABLE", label: "Có sẵn" },
  { value: "UNAVAILABLE", label: "Không có sẵn" },
  { value: "RESERVED", label: "Đã đặt" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "REPAIRING", label: "Đang sửa chữa" },
];

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
  depotId: string;
  onDepotChange: (v: string) => void;
  modelId: string;
  onModelChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  onClearFilters: () => void;
  depots: Depot[];
  models: Model[];
  onAdd: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  depotId,
  onDepotChange,
  modelId,
  onModelChange,
  status,
  onStatusChange,
  onClearFilters,
  depots,
  models,
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
                  placeholder="Biển số xe"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-8 h-9 bg-background text-sm"
                />
              </div>
            </div>

            {/* Depot Filter */}
            <div className="flex-1 min-w-[130px] max-w-[170px]">
              <Select value={depotId || "all"} onValueChange={(v) => onDepotChange(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Tất cả trạm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạm</SelectItem>
                  {depots.map((depot) => (
                    <SelectItem key={depot.id} value={depot.id}>
                      {depot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Filter */}
            <div className="flex-1 min-w-[130px] max-w-[170px]">
              <Select value={modelId || "all"} onValueChange={(v) => onModelChange(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Tất cả model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả model</SelectItem>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[130px] max-w-[170px]">
              <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1 min-w-[130px] max-w-[170px]">
              <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
                <SelectTrigger className="h-9 bg-background text-sm">
                  <SelectValue placeholder="Không sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không sắp xếp</SelectItem>
                  <SelectItem value="licensePlate">Biển số xe</SelectItem>
                  <SelectItem value="modelName">Tên model</SelectItem>
                  <SelectItem value="depotName">Tên depot</SelectItem>
                  <SelectItem value="status">Trạng thái</SelectItem>
                  <SelectItem value="batteryHealth">Tình trạng pin</SelectItem>
                  <SelectItem value="createdAt">Ngày tạo</SelectItem>
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
            Thêm xe điện
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
