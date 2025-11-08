import { Search, User, Building2, ListChecks, CircleDollarSign, RotateCcw, Calendar, Filter } from "lucide-react";
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
    <Card className="shadow-sm border">
      <CardContent className="p-6 space-y-6">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full sm:max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng"
                value={searchOrderCode}
                onChange={(e) => onSearchOrderCodeChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
                className="pl-10 pr-4 h-10"
              />
            </div>
            <Button 
              onClick={onSearch} 
              size="default"
              disabled={!searchOrderCode.trim()}
              className="h-10 px-6"
            >
              Tìm kiếm
            </Button>
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

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-filter" className="text-sm font-medium flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Khách hàng
              </Label>
              <Select value={selectedUserId || "all"} onValueChange={(value) => onSelectedUserIdChange(value === "all" ? "" : value)}>
                <SelectTrigger id="user-filter" className="h-10">
                  <SelectValue placeholder="Chọn khách hàng" />
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

            <div className="space-y-2">
              <Label htmlFor="depot-filter" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Trạm xe điện
              </Label>
              <Select value={selectedDepotId || "all"} onValueChange={(value) => onSelectedDepotIdChange(value === "all" ? "" : value)}>
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
              <Label htmlFor="status-filter" className="text-sm font-medium flex items-center gap-2">
                <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
                Trạng thái
              </Label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger id="status-filter" className="h-10">
                  <SelectValue placeholder="Chọn trạng thái" />
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

            <div className="space-y-2">
              <Label htmlFor="payment-filter" className="text-sm font-medium flex items-center gap-2">
                <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Thanh toán
              </Label>
              <Select value={paymentStatusFilter} onValueChange={onPaymentStatusFilterChange}>
                <SelectTrigger id="payment-filter" className="h-10">
                  <SelectValue placeholder="Chọn trạng thái thanh toán" />
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

