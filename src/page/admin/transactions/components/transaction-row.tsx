import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
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
  user?: UserFull;
  order?: OrderBookingDetail;
}

export function TransactionTableRow({
  transaction,
  onViewDetails,
  onViewUser,
  user,
  order,
}: TransactionTableRowProps) {
  const amount = parseFloat(transaction.tranferAmount || "0");
  const isIncoming = transaction.transferType === "in";

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium text-blue-600">
        {transaction.code || "N/A"}
      </TableCell>
      <TableCell>
        {formatDate(transaction.transactionDate)}
      </TableCell>
      <TableCell>
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
      <TableCell className="font-medium text-green-600">
        {order?.code || transaction.orderBookingId || "N/A"}
      </TableCell>
      <TableCell>
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
            className={isIncoming ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}
          >
            {isIncoming ? "Nhận vào" : "Gửi đi"}
          </Badge>
        )}
      </TableCell>
      <TableCell className={`font-semibold ${isIncoming ? "text-green-600" : "text-red-600"}`}>
        {isIncoming ? "+" : "-"} {vnd(amount)} VNĐ
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {transaction.referenceCode || "N/A"}
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(transaction)}>
          <Eye className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

