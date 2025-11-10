import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MembershipLevel, MembershipConfigRequest } from "@/@types/membership";

interface MembershipConfigFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<MembershipLevel> | null;
  onSubmit: (payload: MembershipConfigRequest | { discountPercent: number; requiredAmount: number }) => Promise<void> | void;
}

const MembershipConfigFormDialog: React.FC<MembershipConfigFormDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}) => {
  const [level, setLevel] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!initialData?.id;

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // Edit mode: chỉ có thể chỉnh discountPercent và requiredAmount
        setLevel(initialData.level || "");
        setDiscountPercent(initialData.discountPercent?.toString() || "");
        setRequiredAmount(initialData.requiredAmount?.toString() || "");
      } else {
        // Create mode: reset form
        setLevel("");
        setDiscountPercent("");
        setRequiredAmount("");
      }
    } else {
      // Reset form when dialog closes
      setLevel("");
      setDiscountPercent("");
      setRequiredAmount("");
    }
  }, [initialData, open, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode) {
      // Edit: chỉ cần discountPercent và requiredAmount
      if (!discountPercent.trim() || !requiredAmount.trim()) return;
      const discount = parseFloat(discountPercent);
      const amount = parseFloat(requiredAmount);
      if (isNaN(discount) || isNaN(amount) || discount < 0 || discount > 100 || amount < 0) return;
      
      try {
        setSubmitting(true);
        await onSubmit({ discountPercent: discount, requiredAmount: amount });
        onOpenChange(false);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Create: cần đầy đủ thông tin
      if (!level.trim() || !discountPercent.trim() || !requiredAmount.trim()) return;
      const discount = parseFloat(discountPercent);
      const amount = parseFloat(requiredAmount);
      if (isNaN(discount) || isNaN(amount) || discount < 0 || discount > 100 || amount < 0) return;

      try {
        setSubmitting(true);
        await onSubmit({
          level: level.trim(),
          discountPercent: discount,
          requiredAmount: amount,
        } as MembershipConfigRequest);
        onOpenChange(false);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Sửa hạng thành viên" : "Thêm hạng thành viên mới"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Thay đổi thông tin hạng thành viên tại đây. Chỉ có thể chỉnh sửa mức giảm giá và số tiền yêu cầu."
              : "Thêm mới một hạng thành viên vào hệ thống. Điền đầy đủ các trường bắt buộc."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Level - nhập thủ công khi tạo mới, chỉ hiển thị khi tạo mới */}
            <div className="space-y-2">
              <Label htmlFor="level">
                Hạng <span className="text-red-500 ml-1">*</span>
              </Label>
              {isEditMode ? (
                <Input id="level" value={level} disabled className="bg-muted" />
              ) : (
                <Input
                  id="level"
                  placeholder="Nhập mã hạng (ví dụ: PLATINUM)"
                  value={level}
                  onChange={(e) => setLevel(e.target.value.toUpperCase())}
                  autoComplete="off"
                  maxLength={50}
                  required
                />
              )}
              {!isEditMode && (
                <p className="text-xs text-muted-foreground">
                  Mã hạng nên viết hoa và là duy nhất (ví dụ: BRONZE, SILVER, PLATINUM...).
                </p>
              )}
            </div>

            {/* Discount Percent */}
            <div className="space-y-2">
              <Label htmlFor="discountPercent">
                Mức giảm giá (%) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="discountPercent"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="Nhập mức giảm giá (0-100)"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                onKeyDown={(e) => ['e', 'E'].includes(e.key) && e.preventDefault()}
                required
              />
            </div>

            {/* Required Amount */}
            <div className="space-y-2">
              <Label htmlFor="requiredAmount">
                Số tiền yêu cầu (VND) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="requiredAmount"
                type="number"
                min="0"
                step="1000"
                placeholder="Nhập số tiền yêu cầu"
                value={requiredAmount}
                onChange={(e) => setRequiredAmount(e.target.value)}
                onKeyDown={(e) => ['e', 'E'].includes(e.key) && e.preventDefault()}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
            >
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipConfigFormDialog;

