import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Depot, DepotRequest } from "@/@types/car/depot";

interface DepotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Depot> | null;
  onSubmit: (payload: DepotRequest) => Promise<void> | void;
}

const formatTimeForInput = (time?: string | null): string => {
  if (!time) return "";
  const timePart = time.includes("T") ? time.split("T")[1]?.split(".")[0] ?? "" : time;
  const [hours, minutes] = timePart.split(":");
  if (hours && minutes) {
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  return timePart.substring(0, 5);
};

const formatTimeForApi = (time: string): string => {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length === 2) {
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
  }
  return time;
};

const DepotFormDialog: React.FC<DepotFormDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [mapId, setMapId] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [lattitude, setLattitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setMapId(initialData?.mapId ?? "");
      setProvince(initialData?.province ?? "");
      setDistrict(initialData?.district ?? "");
      setWard(initialData?.ward ?? "");
      setStreet(initialData?.street ?? "");
      setLattitude(initialData?.lattitude ? String(initialData.lattitude) : "");
      setLongitude(initialData?.longitude ? String(initialData.longitude) : "");
      setOpenTime(formatTimeForInput(initialData?.openTime));
      setCloseTime(formatTimeForInput(initialData?.closeTime));
    } else {
      // Reset form when dialog closes
      setName("");
      setMapId("");
      setProvince("");
      setDistrict("");
      setWard("");
      setStreet("");
      setLattitude("");
      setLongitude("");
      setOpenTime("");
      setCloseTime("");
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mapId.trim() || !province.trim() || !district.trim() || !ward.trim() || !street.trim() || !lattitude.trim() || !longitude.trim() || !openTime.trim() || !closeTime.trim()) return;
    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        mapId: mapId.trim(),
        province: province.trim(),
        district: district.trim(),
        ward: ward.trim(),
        street: street.trim(),
        lattitude: lattitude.trim(), // Note: API expects "lattitude" (2 t's)
        longitude: longitude.trim(),
        openTime: formatTimeForApi(openTime.trim()),
        closeTime: formatTimeForApi(closeTime.trim()),
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditMode = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditMode ? "Sửa trạm" : "Thêm trạm mới"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Thay đổi thông tin trạm tại đây. Nhấn lưu khi bạn hoàn thành."
              : "Thêm mới một trạm vào hệ thống. Điền đầy đủ các trường bắt buộc."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên trạm <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên trạm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Map ID */}
            <div className="space-y-2">
              <Label htmlFor="mapId">
                Map ID <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="mapId"
                placeholder="Nhập Map ID"
                value={mapId}
                onChange={(e) => setMapId(e.target.value)}
                disabled={isEditMode}
                required
              />
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">
                  Tỉnh/Thành phố <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="province"
                  placeholder="Nhập tỉnh/thành phố"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">
                  Quận/Huyện <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="district"
                  placeholder="Nhập quận/huyện"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ward">
                  Phường/Xã <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="ward"
                  placeholder="Nhập phường/xã"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">
                  Đường <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="street"
                  placeholder="Nhập tên đường"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">
                  Vĩ độ <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="Nhập vĩ độ"
                  value={lattitude}
                  onChange={(e) => setLattitude(e.target.value)}
                  onKeyDown={(e) => ['e', 'E'].includes(e.key) && e.preventDefault()}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">
                  Kinh độ <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="Nhập kinh độ"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  onKeyDown={(e) => ['e', 'E'].includes(e.key) && e.preventDefault()}
                  required
                />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openTime">
                  Giờ mở cửa <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="openTime"
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">
                  Giờ đóng cửa <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 mt-4">
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

export default DepotFormDialog;

