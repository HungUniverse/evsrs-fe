import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, DollarSign } from "lucide-react";

interface RefundDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refundedAmount: string;
  onRefundedAmountChange: (amount: string) => void;
  adminRefundNote: string;
  onAdminRefundNoteChange: (note: string) => void;
  submitting: boolean;
  onConfirm: () => void;
}

export function RefundDialog({
  isOpen,
  onClose,
  refundedAmount,
  onRefundedAmountChange,
  adminRefundNote,
  onAdminRefundNoteChange,
  submitting,
  onConfirm,
}: RefundDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="size-5 text-green-600" />
            Tiến hành hoàn tiền
          </DialogTitle>
          <DialogDescription>Nhập số tiền cần hoàn và ghi chú cho đơn đặt xe.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Số tiền hoàn (VNĐ)</Label>
            <Input
              type="number"
              placeholder="Nhập số tiền hoàn"
              value={refundedAmount}
              onChange={(e) => onRefundedAmountChange(e.target.value)}
              min={0}
              disabled={submitting}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Ghi chú của quản trị viên</Label>
            <Textarea
              placeholder="Nhập ghi chú (không bắt buộc)"
              value={adminRefundNote}
              onChange={(e) => onAdminRefundNoteChange(e.target.value)}
              className="min-h-[96px] mt-1 resize-none"
              disabled={submitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button onClick={onConfirm} disabled={submitting}>
            {submitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </div>
            ) : (
              "Xác nhận hoàn tiền"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

