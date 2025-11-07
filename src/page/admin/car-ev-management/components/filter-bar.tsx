import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, CarFront, CircleDot, ArrowUpDown, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SortValue } from "@/hooks/use-car-ev-table-state";
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
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Add Button Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo biển số xe..."
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

          {/* Depot Filter */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                  <MapPin className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Trạm xe điện</TooltipContent>
            </Tooltip>
            <Select value={depotId || "all"} onValueChange={(v) => onDepotChange(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[220px] h-9">
                <SelectValue placeholder="Chọn trạm xe điện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạm xe điện</SelectItem>
                {depots.map((depot) => (
                  <SelectItem key={depot.id} value={depot.id}>
                    {depot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Filter */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                  <CarFront className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Model xe</TooltipContent>
            </Tooltip>
            <Select value={modelId || "all"} onValueChange={(v) => onModelChange(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[220px] h-9">
                <SelectValue placeholder="Chọn model" />
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
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                  <CircleDot className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Trạng thái</TooltipContent>
            </Tooltip>
            <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[220px] h-9">
                <SelectValue placeholder="Chọn trạng thái" />
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <Select value={sort} onValueChange={(v) => onSortChange(v as SortValue)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sắp xếp theo..." />
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

