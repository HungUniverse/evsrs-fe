import { Search, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "./date-range-picker";

interface TransactionTableToolbarProps {
  searchCode: string;
  onSearchCodeChange: (value: string) => void;
  startDateFilter: string;
  onStartDateFilterChange: (value: string) => void;
  endDateFilter: string;
  onEndDateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  pageSize: number;
  onPageSizeChange: (size: string) => void;
}

export function TransactionTableToolbar({
  searchCode,
  onSearchCodeChange,
  startDateFilter,
  onStartDateFilterChange,
  endDateFilter,
  onEndDateFilterChange,
  onClearFilters,
  pageSize,
  onPageSizeChange,
}: TransactionTableToolbarProps) {
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
          {/* Search Code Input */}
          <div className="flex-1 min-w-[150px] max-w-[220px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Mã giao dịch"
                value={searchCode}
                onChange={(e) => onSearchCodeChange(e.target.value)}
                className="pl-8 h-9 bg-background text-sm"
              />
            </div>
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

