import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin } from "lucide-react";
import type { Depot } from "@/@types/car/depot";
import type { UserFull } from "@/@types/auth.type";

interface ChangeDepotDialogProps {
  isOpen: boolean;
  user: UserFull | null;
  selectedDepotId: string;
  depotList: Depot[];
  onDepotChange: (depotId: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ChangeDepotDialog({
  isOpen,
  user,
  selectedDepotId,
  depotList,
  onDepotChange,
  onClose,
  onConfirm,
  isSubmitting,
}: ChangeDepotDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Thay đổi trạm làm việc</DialogTitle>
          <DialogDescription>
            Chọn trạm mới cho nhân viên {user?.fullName || user?.userName || ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              Trạm làm việc
            </Label>
            <Select value={selectedDepotId} onValueChange={onDepotChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạm" />
              </SelectTrigger>
              <SelectContent>
                {depotList.map((depot) => (
                  <SelectItem key={depot.id} value={depot.id}>
                    {depot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

