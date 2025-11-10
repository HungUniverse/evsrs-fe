import { Search, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../utils/utils";

interface OrderTableToolbarProps {
  searchOrderCode: string;
  onSearchOrderCodeChange: (value: string) => void;
  onSearch: () => void;
  pageSize: number;
  onPageSizeChange: (size: string) => void;
  selectedUserId: string;
  onSelectedUserIdChange: (value: string) => void;
  selectedDepotId: string;
  onSelectedDepotIdChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusFilterChange: (value: string) => void;
  startDateFilter: string;
  onStartDateFilterChange: (value: string) => void;
  endDateFilter: string;
  onEndDateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  users: UserFull[];
  depots: Depot[];
}

export function OrderTableToolbar({
  searchOrderCode,
  onSearchOrderCodeChange,
  onSearch,
  pageSize,
  onPageSizeChange,
  selectedUserId,
  onSelectedUserIdChange,
  selectedDepotId,
  onSelectedDepotIdChange,
  statusFilter,
  onStatusFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  startDateFilter,
  onStartDateFilterChange,
  endDateFilter,
  onEndDateFilterChange,
  onClearFilters,
  users,
  depots,
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

          {/* User Filter */}
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={selectedUserId || "all"} onValueChange={(value) => onSelectedUserIdChange(value === "all" ? "" : value)}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khách hàng</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName || user.userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Depot Filter */}
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={selectedDepotId || "all"} onValueChange={(value) => onSelectedDepotIdChange(value === "all" ? "" : value)}>
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

          {/* Status Filter */}
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-9 bg-background text-sm">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
