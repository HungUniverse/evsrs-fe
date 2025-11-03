import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import type { IdentifyDocumentStatus } from "@/@types/enum";

// Helper function to translate status to Vietnamese
function getStatusLabel(status: IdentifyDocumentStatus | "APPROVED" | "REJECTED"): string {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ",
    APPROVED: "Đã duyệt",
    REJECTED: "Đã từ chối",
  };
  return statusMap[status] || status;
}

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserFull | null;
  document: IdentifyDocumentResponse | null;
  newStatus: "APPROVED" | "REJECTED";
  currentStatus: IdentifyDocumentStatus;
  verificationNotes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
}

export function StatusChangeDialog({
  isOpen,
  onClose,
  user,
  newStatus,
  currentStatus,
  verificationNotes,
  onNotesChange,
  onConfirm,
}: StatusChangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`}
                alt={user.fullName || "User"}
                className="size-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium">
                  {user.fullName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {user.userName}
                </p>
              </div>
            </div>

            {/* Status Change Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">
                  Trạng thái hiện tại:
                </span>
                <Badge
                  variant={
                    currentStatus === "APPROVED"
                      ? "default"
                      : currentStatus === "REJECTED"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {getStatusLabel(currentStatus)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Trạng thái mới:</span>
                <Badge
                  variant={
                    newStatus === "APPROVED"
                      ? "default"
                      : "destructive"
                  }
                >
                  {getStatusLabel(newStatus)}
                </Badge>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-3 rounded-lg border bg-amber-50 text-amber-800">
              <p className="text-sm">
                {newStatus === "APPROVED"
                  ? "Tài liệu sẽ được duyệt và người dùng có thể sử dụng dịch vụ."
                  : "Tài liệu sẽ bị từ chối và có thể ảnh hưởng đến khả năng sử dụng dịch vụ của người dùng."}
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ghi chú (tùy chọn)
              </Label>
              <textarea
                value={verificationNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Nhập ghi chú cho việc thay đổi trạng thái..."
                className="w-full min-h-[80px] p-3 border rounded-md resize-none text-sm"
              />
            </div>

            {/* Action Buttons */}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                onClick={onConfirm}
                variant={
                  newStatus === "APPROVED"
                    ? "default"
                    : "destructive"
                }
              >
                {newStatus === "APPROVED"
                  ? "Duyệt tài liệu"
                  : "Từ chối tài liệu"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
