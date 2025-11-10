import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import type { IdentifyDocumentStatus } from "@/@types/enum";
import { getStatusLabel } from "../utils/utils";

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
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" />
            Xác nhận thay đổi trạng thái
          </DialogTitle>
          <DialogDescription>Bạn đang thay đổi trạng thái tài liệu định danh của người dùng</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30 shadow-sm">
            <img
              src={
                user.profilePicture && user.profilePicture.trim() !== ""
                  ? user.profilePicture
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`
              }
              alt={user.fullName || "User"}
              className="size-12 rounded-full object-cover border-2 border-background shadow-md"
            />
            <div>
              <h4 className="font-medium">{user.fullName}</h4>
              <p className="text-sm text-muted-foreground">{user.userName}</p>
            </div>
          </div>

          {/* Status Change Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <span className="text-sm font-medium">Trạng thái hiện tại:</span>
              <Badge
                variant={
                  currentStatus === "APPROVED"
                    ? "soft-green"
                    : currentStatus === "REJECTED"
                      ? "soft-red"
                      : "soft-gray"
                }
              >
                {getStatusLabel(currentStatus)}
              </Badge>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="size-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-card">
              <span className="text-sm font-medium">Trạng thái mới:</span>
              <Badge variant={newStatus === "APPROVED" ? "soft-green" : "soft-red"} className="text-sm">
                {getStatusLabel(newStatus)}
              </Badge>
            </div>
          </div>

          {/* Warning Message */}
          <div
            className={`p-4 rounded-lg border ${
              newStatus === "APPROVED"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-start gap-2">
              {newStatus === "APPROVED" ? (
                <CheckCircle2 className="size-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="size-5 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm">
                {newStatus === "APPROVED"
                  ? "Tài liệu sẽ được duyệt và người dùng có thể sử dụng dịch vụ."
                  : "Tài liệu sẽ bị từ chối và có thể ảnh hưởng đến khả năng sử dụng dịch vụ của người dùng."}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Ghi chú <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Textarea
              value={verificationNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Nhập ghi chú cho việc thay đổi trạng thái..."
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex-shrink-0 gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className={
              newStatus === "APPROVED"
                ? "min-w-[140px] bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
                : "min-w-[140px] bg-red-200 text-red-900 hover:bg-red-300"
            }
          >
            {newStatus === "APPROVED" ? "Duyệt tài liệu" : "Từ chối tài liệu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

