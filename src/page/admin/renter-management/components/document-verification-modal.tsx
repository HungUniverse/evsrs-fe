import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { getStatusLabel } from "../utils/utils";

interface DocumentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserFull | null;
  document: IdentifyDocumentResponse | null;
  action: "approve" | "reject";
  onActionChange: (action: "approve" | "reject") => void;
  verificationNotes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
}

export function DocumentVerificationModal({
  isOpen,
  onClose,
  user,
  document,
  action,
  onActionChange,
  verificationNotes,
  onNotesChange,
  onConfirm,
}: DocumentVerificationModalProps) {
  if (!user || !document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-muted-foreground" />
            Xác thực tài liệu
          </DialogTitle>
          <DialogDescription>Xem xét và quyết định trạng thái tài liệu định danh của người dùng</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/30 shadow-sm">
            <img
              src={
                user.profilePicture && user.profilePicture.trim() !== ""
                  ? user.profilePicture
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`
              }
              alt={user.fullName || "User"}
              className="size-14 rounded-full object-cover border-2 border-background shadow-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.userName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Trạng thái hiện tại:</span>
                <Badge
                  variant={
                    document.status === "APPROVED"
                      ? "default"
                      : document.status === "REJECTED"
                        ? "destructive"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {getStatusLabel(document.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Chọn hành động</Label>
            <RadioGroup value={action} onValueChange={onActionChange} className="grid gap-3">
              <label
                htmlFor="r-approve"
                className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  action === "approve"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : "border-muted hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="approve" id="r-approve" />
                <div className="flex items-center gap-2 flex-1">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  <div>
                    <div className="font-medium">Duyệt tài liệu</div>
                    <div className="text-xs text-muted-foreground">Tài liệu sẽ được phê duyệt và người dùng có thể sử dụng dịch vụ</div>
                  </div>
                </div>
              </label>
              <label
                htmlFor="r-reject"
                className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  action === "reject"
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-muted hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="reject" id="r-reject" />
                <div className="flex items-center gap-2 flex-1">
                  <XCircle className="size-5 text-red-600" />
                  <div>
                    <div className="font-medium">Từ chối tài liệu</div>
                    <div className="text-xs text-muted-foreground">Tài liệu sẽ bị từ chối và người dùng cần cập nhật lại</div>
                  </div>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Ghi chú <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Textarea
              value={verificationNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Nhập ghi chú về quyết định xác thực..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-shrink-0 gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            variant={action === "reject" ? "destructive" : "default"}
            className="min-w-[120px]"
          >
            {action === "approve" ? "Duyệt tài liệu" : "Từ chối tài liệu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

