import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { UserFull } from "@/@types/auth.type";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  users: UserFull[];
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  users,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const selectedCount = users.length;
  const isSingleUser = selectedCount === 1;
  const isConfirmationValid = confirmationText === "Xác nhận";

  const getDialogContent = () => {
    if (isSingleUser) {
      return {
        title: "Xác nhận xóa người dùng",
        description: `Bạn có chắc chắn muốn xóa người dùng "${users[0].fullName}" không? Hành động này không thể hoàn tác.`,
        icon: <Trash2 className="size-6 text-red-500" />,
        confirmText: "Xóa người dùng",
        severity: "warning",
      };
    } else {
      return {
        title: "Xác nhận xóa nhiều người dùng",
        description: `Bạn có chắc chắn muốn xóa ${selectedCount} người dùng đã chọn không? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến hệ thống.`,
        icon: <Users className="size-6 text-red-500" />,
        confirmText: `Xóa ${selectedCount} người dùng`,
        severity: "danger",
      };
    }
  };

  const content = getDialogContent();

  // Reset confirmation text when dialog closes
  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {content.icon}
            <DialogTitle className="text-left">{content.title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        {/* Hiển thị danh sách người dùng sẽ bị xóa */}
        {selectedCount > 0 && selectedCount <= 10 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Người dùng sẽ bị xóa:
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded"
                >
                  <div className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {(user.fullName || "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {user.fullName || "Không có tên"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.userEmail || user.userName}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCount > 10 && (
          <div className="p-3 bg-muted/50 rounded">
            <p className="text-sm text-muted-foreground">
              Sẽ xóa <strong>{selectedCount}</strong> người dùng đã chọn.
            </p>
          </div>
        )}

        {/* Input xác nhận */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Để xác nhận, vui lòng nhập <span className="font-semibold text-red-600">"Xác nhận"</span> vào ô bên dưới:
          </label>
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Nhập 'Xác nhận' để tiếp tục"
            className="w-full"
            disabled={isDeleting}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || !isConfirmationValid}
            className={
              content.severity === "critical"
                ? "bg-red-600 hover:bg-red-700 text-white font-semibold"
                : ""
            }
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa...
              </div>
            ) : (
              content.confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
