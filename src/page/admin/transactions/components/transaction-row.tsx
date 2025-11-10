import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { TransactionResponse } from "@/@types/payment/transaction";
import type { UserFull } from "@/@types/auth.type";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import { getStatusVariant, getStatusLabel } from "@/page/admin/order-management/utils/utils";

interface TransactionTableRowProps {
  transaction: TransactionResponse;
  onViewDetails: (transaction: TransactionResponse) => void;
  onViewUser: (userId: string) => void;
  onViewOrder: (orderId: string) => void;
  user?: UserFull;
  order?: OrderBookingDetail;
}

export function TransactionTableRow({
  transaction,
  onViewDetails,
  onViewUser,
  onViewOrder,
  user,
  order,
}: TransactionTableRowProps) {
  const amount = parseFloat(transaction.tranferAmount || "0");
  const isIncoming = transaction.transferType === "in";

  const handleOrderClick = () => {
    if (transaction.orderBookingId) {
      onViewOrder(transaction.orderBookingId);
    }
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors group">
      <TableCell className="font-medium whitespace-nowrap sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
        {transaction.code ? (
          <button
            type="button"
            onClick={() => onViewDetails(transaction)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            {transaction.code}
          </button>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {formatDate(transaction.transactionDate)}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {user ? (
          <button
            type="button"
            className="font-medium text-blue-600 hover:underline transition-colors text-left"
            onClick={() => {
              if (transaction.userId) onViewUser(transaction.userId);
            }}
          >
            {user.fullName || user.userName || "N/A"}
          </button>
        ) : (
          <span className="text-muted-foreground">Đang tải...</span>
        )}
      </TableCell>
      <TableCell className="font-medium whitespace-nowrap">
        {transaction.orderBookingId ? (
          <button
            type="button"
            onClick={handleOrderClick}
            className="text-green-600 hover:underline cursor-pointer"
          >
            {order?.code || transaction.orderBookingId}
          </button>
        ) : (
          <span className="text-green-600">N/A</span>
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {order ? (
          <Badge
            variant={(getStatusVariant(order.status) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}
            className="whitespace-nowrap"
          >
            {getStatusLabel(order.status)}
          </Badge>
        ) : (
          <Badge
            variant={isIncoming ? "default" : "secondary"}
            className={`whitespace-nowrap ${isIncoming ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}`}
          >
            {isIncoming ? "Nhận vào" : "Gửi đi"}
          </Badge>
        )}
      </TableCell>
      <TableCell className={`font-semibold whitespace-nowrap ${isIncoming ? "text-green-600" : "text-red-600"}`}>
        {isIncoming ? "+" : "-"} {vnd(amount)} VNĐ
      </TableCell>
      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
        {transaction.referenceCode || "N/A"}
      </TableCell>
    </TableRow>
  );
}

