import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionResponse } from "@/@types/payment/transaction";
import { TransactionTableRow } from "./transaction-row";
import { CreditCard } from "lucide-react";
import { TableCell } from "@/components/ui/table";
import type { UserFull } from "@/@types/auth.type";
import type { OrderBookingDetail } from "@/@types/order/order-booking";

interface TransactionTableProps {
  transactions: TransactionResponse[];
  loading: boolean;
  onViewDetails: (transaction: TransactionResponse) => void;
  onViewUser: (userId: string) => void;
  onViewOrder: (orderId: string) => void;
  usersMap: Map<string, UserFull>;
  ordersMap: Map<string, OrderBookingDetail>;
}

export function TransactionTable({
  transactions,
  loading,
  onViewDetails,
  onViewUser,
  onViewOrder,
  usersMap,
  ordersMap,
}: TransactionTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã giao dịch</TableHead>
            <TableHead>Ngày giao dịch</TableHead>
            <TableHead>Người dùng</TableHead>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Mã tham chiếu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <CreditCard className="size-8" />
                  <div>
                    <p className="text-sm font-semibold">Chưa có giao dịch nào</p>
                    <p className="text-xs">Không có dữ liệu giao dịch để hiển thị.</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onViewDetails={onViewDetails}
                onViewUser={onViewUser}
                onViewOrder={onViewOrder}
                user={usersMap.get(transaction.userId)}
                order={ordersMap.get(transaction.orderBookingId)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

