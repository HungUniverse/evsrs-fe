import { Search, User, RotateCcw, ArrowUpDown, Calendar, Filter } from "lucide-react";
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
    <Card className="shadow-sm border">
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã giao dịch hoặc mã tham chiếu..."
                value={searchCode}
                onChange={(e) => onSearchCodeChange(e.target.value)}
                className="pl-10 pr-4 h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Label htmlFor="page-size" className="text-sm font-medium whitespace-nowrap">
              Số dòng/trang:
            </Label>
            <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
              <SelectTrigger id="page-size" className="w-[100px] h-10">
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
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Từ ngày
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDateFilter}
                onChange={(e) => onStartDateFilterChange(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Đến ngày
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDateFilter}
                onChange={(e) => onEndDateFilterChange(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-search" className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Tìm theo người dùng
              </Label>
              <Input
                id="user-search"
                placeholder="Nhập tên người dùng..."
                value={userNameSearch}
                onChange={(e) => onUserNameSearchChange(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-type-filter" className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                Loại giao dịch
              </Label>
              <Select value={transferTypeFilter} onValueChange={onTransferTypeFilterChange}>
                <SelectTrigger id="transfer-type-filter" className="h-10">
                  <SelectValue placeholder="Chọn loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="in">Nhận vào</SelectItem>
                  <SelectItem value="out">Gửi đi</SelectItem>
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
}

