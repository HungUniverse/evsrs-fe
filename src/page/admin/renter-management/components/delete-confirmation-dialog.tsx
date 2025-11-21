import * as React from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Users, AlertTriangle, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [confirmationText, setConfirmationText] = React.useState("");

  const selectedCount = users.length;
  const isSingleUser = selectedCount === 1;
  const isConfirmationValid = confirmationText.trim().toLowerCase() === "xác nhận".toLowerCase();

  React.useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);

  const content = React.useMemo(() => {
    if (isSingleUser) {
      const user = users[0];
      return {
        title: "Xác nhận xóa người dùng",
        description: `Bạn có chắc chắn muốn xóa người dùng "${user.fullName || user.userName}" không? Hành động này không thể hoàn tác.`,
        confirmLabel: "Xóa người dùng",
        Icon: Trash2,
      } as const;
    }

    return {
      title: "Xác nhận xóa nhiều người dùng",
      description: `Bạn có chắc chắn muốn xóa ${selectedCount} người dùng đã chọn không? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến hệ thống.`,
      confirmLabel: `Xóa ${selectedCount} người dùng`,
      Icon: Users,
    } as const;
  }, [isSingleUser, selectedCount, users]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogPortal>
        <DialogOverlay className="z-[100]" />
        <DialogPrimitive.Content
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[100] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
          )}
        >
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-950">
              <content.Icon className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-left">{content.title}</DialogTitle>
          </div>
          <DialogDescription className="text-left text-muted-foreground">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        {selectedCount > 0 && selectedCount <= 8 && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Người dùng sẽ bị xóa
            </p>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-lg bg-background px-3 py-2 shadow-sm">
                  <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-xs font-semibold">
                    {(user.fullName || user.userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.fullName || "Không có tên"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.userEmail || user.userName}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCount > 8 && (
          <div className="rounded-lg border border-dashed border-red-200 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Sẽ xóa <strong>{selectedCount}</strong> người dùng đã chọn.
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nhập <span className="font-semibold text-red-600">"Xác nhận"</span> để thực hiện thao tác này
          </label>
          <Input
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            placeholder="Nhập 'Xác nhận' để tiếp tục"
            disabled={isDeleting}
            className="w-full"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting || !isConfirmationValid}>
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xóa...
              </div>
            ) : (
              content.confirmLabel
            )}
          </Button>
        </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

