import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CarManufacture, CarManufactureRequest } from "@/@types/car/carManufacture";
import LogoUploader from "./logo-uploader";

interface CarManufactureFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<CarManufacture> | null;
  onSubmit: (payload: CarManufactureRequest) => Promise<void> | void;
}

const CarManufactureFormDialog: React.FC<CarManufactureFormDialogProps> = ({ open, onOpenChange, initialData, onSubmit }) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initialData?.name ?? "");
    setLogo(initialData?.logo ?? "");
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), logo: logo.trim() });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Sửa nhà sản xuất xe" : "Thêm nhà sản xuất xe"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="manufacture-name">Tên nhà sản xuất xe</Label>
            <Input
              id="manufacture-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên nhà sản xuất xe"
              required
            />
          </div>
          <LogoUploader value={logo} onChange={setLogo} />
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

export default CarManufactureFormDialog;

