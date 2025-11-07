import { Search, User, Building2, ListChecks, CircleDollarSign, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../utils/utils";

interface OrderTableToolbarProps {
  searchOrderId: string;
  onSearchOrderIdChange: (value: string) => void;
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
  searchOrderId,
  onSearchOrderIdChange,
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
    <div className="flex flex-col gap-4">
      {/* First row: Search bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã đơn đặt xe..."
            value={searchOrderId}
            onChange={(e) => onSearchOrderIdChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="flex-1 max-w-md"
          />
          <Button onClick={onSearch} size="sm" variant="outline" disabled={!searchOrderId.trim()}>
            Tìm kiếm
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Số dòng mỗi trang:</Label>
          <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
            <SelectTrigger className="w-[120px]">
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

      {/* Second row: Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground whitespace-nowrap">Ngày bắt đầu từ</Label>
          <Input
            type="date"
            value={startDateFilter}
            onChange={(e) => onStartDateFilterChange(e.target.value)}
            className="w-[180px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground whitespace-nowrap">Ngày kết thúc đến</Label>
          <Input
            type="date"
            value={endDateFilter}
            onChange={(e) => onEndDateFilterChange(e.target.value)}
            className="w-[180px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedUserId || "all"} onValueChange={(value) => onSelectedUserIdChange(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Lọc theo khách hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khách hàng</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.fullName || user.userName} - {user.userEmail}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedDepotId || "all"} onValueChange={(value) => onSelectedDepotIdChange(value === "all" ? "" : value)}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Lọc theo trạm xe điện" />
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

        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
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

        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          <Select value={paymentStatusFilter} onValueChange={onPaymentStatusFilterChange}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Lọc theo thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tình trạng thanh toán</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onClearFilters}
          size="sm"
          variant="outline"
          className="sm:ml-auto group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50"
        >
          <RotateCcw className="h-3 w-3 mr-2 transition-transform duration-300 group-hover:rotate-180" />
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
}

