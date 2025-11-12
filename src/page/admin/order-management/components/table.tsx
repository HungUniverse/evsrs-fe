import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { OrderTableRow } from "./order-row";
import { Package } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface OrderTableProps {
  orders: OrderBookingDetail[];
  loading: boolean;
  onUpdateStatus: (order: OrderBookingDetail) => void;
  onRefund: (order: OrderBookingDetail) => void;
  onViewUser: (userId: string) => void;
  startIndex?: number;
}

export function OrderTable({
  orders,
  loading,
  onUpdateStatus,
  onRefund,
  onViewUser,
  startIndex = 1,
}: OrderTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="whitespace-nowrap text-[#065F46] sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 w-16 text-center">STT</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Mã đơn</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Ảnh xe</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Model</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Người thuê</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạm</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tổng tiền</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Trạng thái</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46]">Tình trạng thanh toán</TableHead>
            <TableHead className="whitespace-nowrap text-[#065F46] sticky right-0 bg-[#D1FAE5] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (!orders || orders.length === 0) ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-12">
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
            orders.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                index={startIndex + index}
                onUpdateStatus={onUpdateStatus}
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

