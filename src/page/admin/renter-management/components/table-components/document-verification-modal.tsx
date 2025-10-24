import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xác thực tài liệu</DialogTitle>
        </DialogHeader>

        {user && document && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`}
                alt={user.fullName || "User"}
                className="size-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">
                  {user.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user.userName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Trạng thái hiện tại:
                  </span>
                  <Badge
                    variant={
                      document.status === "APPROVED"
                        ? "default"
                        : document.status === "REJECTED"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {document.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Selection */}
            <div className="space-y-2">
              <Label className="text-sm">Chọn hành động</Label>
              <RadioGroup
                value={action}
                onValueChange={onActionChange}
                className="grid gap-2"
              >
                <div className="flex items-center space-x-2 p-2 border rounded">
                  <RadioGroupItem value="approve" id="r-approve" />
                  <Label htmlFor="r-approve">Duyệt</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded">
                  <RadioGroupItem value="reject" id="r-reject" />
                  <Label htmlFor="r-reject">Từ chối</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm">Ghi chú</Label>
              <textarea
                value={verificationNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Nhập ghi chú..."
                className="w-full min-h-[80px] p-3 border rounded-md resize-none"
              />
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                onClick={onConfirm}
                variant={
                  action === "reject"
                    ? "destructive"
                    : "default"
                }
              >
                {action === "approve" ? "Duyệt" : "Từ chối"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
