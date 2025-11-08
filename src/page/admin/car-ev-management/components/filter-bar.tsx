import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, CarFront, CircleDot, ArrowUpDown, RotateCcw } from "lucide-react";
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
    <Card className="shadow-sm border">
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo biển số xe..."
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

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="depot-filter" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Trạm xe điện
              </Label>
              <Select value={depotId || "all"} onValueChange={(v) => onDepotChange(v === "all" ? "" : v)}>
                <SelectTrigger id="depot-filter" className="h-10">
                  <SelectValue placeholder="Chọn trạm" />
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

            <div className="space-y-2">
              <Label htmlFor="model-filter" className="text-sm font-medium flex items-center gap-2">
                <CarFront className="h-3.5 w-3.5 text-muted-foreground" />
                Model xe
              </Label>
              <Select value={modelId || "all"} onValueChange={(v) => onModelChange(v === "all" ? "" : v)}>
                <SelectTrigger id="model-filter" className="h-10">
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

            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-sm font-medium flex items-center gap-2">
                <CircleDot className="h-3.5 w-3.5 text-muted-foreground" />
                Trạng thái
              </Label>
              <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
                <SelectTrigger id="status-filter" className="h-10">
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

