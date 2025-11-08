import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";
import { STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../utils/utils";

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  status: OrderBookingStatus;
  paymentStatus: PaymentStatus;
  onStatusChange: (status: OrderBookingStatus) => void;
  onPaymentStatusChange: (status: PaymentStatus) => void;
  onConfirm: () => void;
}

export function UpdateStatusDialog({
  isOpen,
  onClose,
  status,
  paymentStatus,
  onStatusChange,
  onPaymentStatusChange,
  onConfirm,
}: UpdateStatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn đặt xe</DialogTitle>
          <DialogDescription className="whitespace-nowrap">
            Cập nhật trạng thái và tình trạng thanh toán cho đơn đặt xe này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={status} onValueChange={(value) => onStatusChange(value as OrderBookingStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tình trạng thanh toán</Label>
            <Select value={paymentStatus} onValueChange={(value) => onPaymentStatusChange(value as PaymentStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onConfirm}>Cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

