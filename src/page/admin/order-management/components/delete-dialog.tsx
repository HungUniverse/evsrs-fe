import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { getStatusLabel } from "../utils/utils";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderBookingDetail | null;
  onConfirm: () => void;
}

export function DeleteDialog({ isOpen, onClose, order, onConfirm }: DeleteDialogProps) {
  if (!order) return null;

  const canDelete = order.status === "PENDING" || order.status === "CANCELLED";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-600" />
            Xác nhận xóa đơn đặt xe
          </DialogTitle>
          <DialogDescription>
            {canDelete ? (
              <>Bạn có chắc chắn muốn xóa đơn đặt xe này? Hành động này không thể hoàn tác.</>
            ) : (
              <>
                <div className="text-red-600 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="size-4" />
                  Cảnh báo: Chỉ có thể xóa đơn đặt xe ở trạng thái "Chờ xác nhận" hoặc "Đã hủy".
                </div>
                <div className="text-sm text-muted-foreground">
                  Trạng thái hiện tại: <span className="font-medium">{getStatusLabel(order.status)}</span>
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={!canDelete}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

