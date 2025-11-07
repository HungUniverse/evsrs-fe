import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, Eye } from "lucide-react";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import { getStatusVariant, getPaymentStatusVariant, getStatusLabel, getPaymentStatusLabel } from "../utils/utils";

interface OrderTableRowProps {
  order: OrderBookingDetail;
  onViewDetails: (order: OrderBookingDetail) => void;
  onUpdateStatus: (order: OrderBookingDetail) => void;
  onDelete: (order: OrderBookingDetail) => void;
  onRefund: (order: OrderBookingDetail) => void;
  onViewUser: (userId: string) => void;
}

export function OrderTableRow({
  order,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  onRefund,
  onViewUser,
}: OrderTableRowProps) {
  const canRefund = order.status === "REFUND_PENDING";

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium text-green-600">
        {order.code ? `${order.code.slice(0, 8)}...` : "N/A"}
      </TableCell>
      <TableCell>
        {order.carEvs?.model?.image ? (
          <img
            src={order.carEvs.model.image}
            alt={order.carEvs.model.modelName}
            className="h-10 w-16 object-cover rounded-md border shadow-sm"
          />
        ) : (
          <span className="text-xs text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell className="font-medium">{order.carEvs?.model?.modelName || "N/A"}</TableCell>
      <TableCell>
        <div>
          <button
            type="button"
            className="font-medium text-blue-600 hover:underline transition-colors"
            onClick={() => {
              if (order.user?.id) onViewUser(order.user.id);
            }}
          >
            {order.user?.fullName || order.user?.userName || "N/A"}
          </button>
          <div className="text-sm text-muted-foreground">{order.user?.userEmail}</div>
        </div>
      </TableCell>
      <TableCell>{formatDate(order.startAt)}</TableCell>
      <TableCell>{formatDate(order.endAt)}</TableCell>
      <TableCell className="font-semibold">{vnd(parseFloat(order.totalAmount))} VNĐ</TableCell>
      <TableCell>
        <Badge
          variant={(getStatusVariant(order.status) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}
          className="whitespace-nowrap"
        >
          {getStatusLabel(order.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={(getPaymentStatusVariant(order.paymentStatus) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}
          className="whitespace-nowrap"
        >
          {getPaymentStatusLabel(order.paymentStatus)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
            <Eye className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit2 className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdateStatus(order)}>Cập nhật trạng thái</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (canRefund) {
                    onRefund(order);
                  }
                }}
                disabled={!canRefund}
              >
                Tiến hành hoàn tiền
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" size="sm" onClick={() => onDelete(order)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

