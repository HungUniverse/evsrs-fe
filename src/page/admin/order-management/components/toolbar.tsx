import { Search, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../utils/utils";
import { DateRangePicker } from "./date-range-picker";

interface OrderTableToolbarProps {
  searchOrderCode: string;
  onSearchOrderCodeChange: (value: string) => void;
  onSearch: () => void;
  pageSize: number;
  onPageSizeChange: (size: string) => void;
  selectedDepotId: string;
  onSelectedDepotIdChange: (value: string) => void;
  selectedModelId: string;
  onSelectedModelIdChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusFilterChange: (value: string) => void;
  startDateFilter: string;
  onStartDateFilterChange: (value: string) => void;
  endDateFilter: string;
  onEndDateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  depots: Depot[];
  models: Model[];
}

export function OrderTableToolbar({
  searchOrderCode,
  onSearchOrderCodeChange,
  onSearch,
  pageSize,
  onPageSizeChange,
  selectedDepotId,
  onSelectedDepotIdChange,
  selectedModelId,
  onSelectedModelIdChange,
  statusFilter,
  onStatusFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  startDateFilter,
  onStartDateFilterChange,
  endDateFilter,
  onEndDateFilterChange,
  onClearFilters,
  depots,
  models,
}: OrderTableToolbarProps) {
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
          {/* Search Order Code Input */}
          <div className="flex-1 min-w-[150px] max-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Mã đơn hàng"
                value={searchOrderCode}
                onChange={(e) => onSearchOrderCodeChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
                className="pl-8 h-9 bg-background text-sm"
              />
            </div>
          </div>

          {/* Depot Filter */}
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={selectedDepotId || "all"} onValueChange={(value) => onSelectedDepotIdChange(value === "all" ? "" : value)}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả trạm" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
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
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={selectedModelId || "all"} onValueChange={(value) => onSelectedModelIdChange(value === "all" ? "" : value)}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả model" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
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
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={paymentStatusFilter} onValueChange={onPaymentStatusFilterChange}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả thanh toán" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                <SelectItem value="all">Tất cả</SelectItem>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Picker */}
          <div className="flex-1 min-w-[240px] max-w-[300px]">
            <DateRangePicker
              startDate={startDateFilter}
              endDate={endDateFilter}
              onStartDateChange={onStartDateFilterChange}
              onEndDateChange={onEndDateFilterChange}
            />
          </div>

          {/* Page Size Select - Compact */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Label htmlFor="page-size" className="text-xs font-medium whitespace-nowrap text-muted-foreground">
              Số dòng:
            </Label>
            <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
              <SelectTrigger id="page-size" className="w-[70px] h-9 bg-background text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button - Compact */}
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="h-9 px-3 text-destructive border-destructive hover:bg-destructive/10 hover:border-destructive/80 hover:text-destructive shrink-0 text-sm transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
