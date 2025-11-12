import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { vnd } from "@/lib/utils/currency";
import { getStatusVariant, getPaymentStatusVariant, getStatusLabel, getPaymentStatusLabel } from "../utils/utils";

interface OrderTableRowProps {
  order: OrderBookingDetail;
  index: number;
  onUpdateStatus: (order: OrderBookingDetail) => void;
  onRefund: (order: OrderBookingDetail) => void;
  onViewUser: (userId: string) => void;
}

export function OrderTableRow({
  order,
  index,
  onUpdateStatus,
  onRefund,
  onViewUser,
}: OrderTableRowProps) {
  const navigate = useNavigate();
  const canRefund = order.status === "REFUND_PENDING";

  const handleOrderCodeClick = () => {
    if (order.id) {
      navigate(`/admin/order/${order.id}`);
    }
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors group">
      <TableCell className="whitespace-nowrap sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors w-16 text-center text-muted-foreground">
        {index}
      </TableCell>
      <TableCell className="font-medium whitespace-nowrap sticky left-16 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
        {order.code ? (
          <button
            type="button"
            onClick={handleOrderCodeClick}
            className="text-green-600 hover:underline cursor-pointer"
          >
            {order.code}
          </button>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
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
      <TableCell className="font-medium whitespace-nowrap">{order.carEvs?.model?.modelName || "N/A"}</TableCell>
      <TableCell className="whitespace-nowrap">
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
      <TableCell className="whitespace-nowrap">
        <div className="font-medium">{order.depot?.name || "N/A"}</div>
      </TableCell>
      <TableCell className="font-semibold whitespace-nowrap">{vnd(parseFloat(order.totalAmount))} VNĐ</TableCell>
      <TableCell className="whitespace-nowrap">
        <Badge
          variant={(getStatusVariant(order.status) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}
          className="whitespace-nowrap"
        >
          {getStatusLabel(order.status)}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <Badge
          variant={(getPaymentStatusVariant(order.paymentStatus) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}
          className="whitespace-nowrap"
        >
          {getPaymentStatusLabel(order.paymentStatus)}
        </Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
        <div className="flex items-center gap-2">
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
        </div>
      </TableCell>
    </TableRow>
  );
}

