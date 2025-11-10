import { Search, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionTableToolbarProps {
  searchCode: string;
  onSearchCodeChange: (value: string) => void;
  userNameSearch: string;
  onUserNameSearchChange: (value: string) => void;
  transferTypeFilter: string;
  onTransferTypeFilterChange: (value: string) => void;
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
  userNameSearch,
  onUserNameSearchChange,
  transferTypeFilter,
  onTransferTypeFilterChange,
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

          {/* User Name Search Input */}
          <div className="flex-1 min-w-[150px] max-w-[220px]">
            <Input
              placeholder="Tên người dùng"
              value={userNameSearch}
              onChange={(e) => onUserNameSearchChange(e.target.value)}
              className="h-9 bg-background text-sm"
            />
          </div>

          {/* Transfer Type Filter */}
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={transferTypeFilter} onValueChange={onTransferTypeFilterChange}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="in">Nhận vào</SelectItem>
                <SelectItem value="out">Gửi đi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Picker */}
          <div className="flex-1 min-w-[130px] max-w-[160px]">
            <Input
              type="date"
              value={startDateFilter}
              onChange={(e) => onStartDateFilterChange(e.target.value)}
              className="h-9 bg-background text-sm"
            />
          </div>

          {/* End Date Picker */}
          <div className="flex-1 min-w-[130px] max-w-[160px]">
            <Input
              type="date"
              value={endDateFilter}
              onChange={(e) => onEndDateFilterChange(e.target.value)}
              className="h-9 bg-background text-sm"
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
              <SelectContent>
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
            className="h-9 px-3 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0 text-sm"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

