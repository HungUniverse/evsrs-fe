import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { OrderTableRow } from "./order-row";
import { Package } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface OrderTableProps {
  orders: OrderBookingDetail[];
  loading: boolean;
  onViewDetails: (order: OrderBookingDetail) => void;
  onUpdateStatus: (order: OrderBookingDetail) => void;
  onDelete: (order: OrderBookingDetail) => void;
  onRefund: (order: OrderBookingDetail) => void;
  onViewUser: (userId: string) => void;
}

export function OrderTable({
  orders,
  loading,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  onRefund,
  onViewUser,
}: OrderTableProps) {
  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Ảnh xe</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Người thuê</TableHead>
            <TableHead>Trạm</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Tình trạng thanh toán</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Package className="size-8" />
                  <div>
                    <p className="text-sm font-semibold">Chưa có đơn đặt xe nào</p>
                    <p className="text-xs">Không có dữ liệu đơn đặt xe để hiển thị.</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                onRefund={onRefund}
                onViewUser={onViewUser}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

