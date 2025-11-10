import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Amenity, AmenityRequest } from "@/@types/car/amentities";

interface AmenityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Amenity> | null;
  onSubmit: (payload: AmenityRequest) => Promise<void> | void;
}

const AmenityFormDialog: React.FC<AmenityFormDialogProps> = ({ open, onOpenChange, initialData, onSubmit }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialData?.name ?? "");
    setIcon((initialData?.icon as string) ?? "");
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), icon: icon.trim() });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Sửa tiện nghi" : "Thêm tiện nghi"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amenity-name">Tên tiện nghi:</Label>
            <Input
              id="amenity-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên tiện nghi"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amenity-icon">Biểu tượng:</Label>
            <Input
              id="amenity-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Nhập biểu tượng"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {initialData?.id ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AmenityFormDialog;


