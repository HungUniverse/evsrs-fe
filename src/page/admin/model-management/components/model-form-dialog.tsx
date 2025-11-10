import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Model, ModelRequest } from "@/@types/car/model";
import type { CarManufacture } from "@/@types/car/carManufacture";
import type { Amenity } from "@/@types/car/amentities";
import ImageUploader from "./image-uploader";

interface ModelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Model> | null;
  manufacturers: CarManufacture[];
  amenities: Amenity[];
  onSubmit: (payload: ModelRequest) => Promise<void> | void;
}

const ModelFormDialog: React.FC<ModelFormDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  manufacturers,
  amenities,
  onSubmit,
}) => {
  const [modelName, setModelName] = useState("");
  const [manufacturerCarId, setManufacturerCarId] = useState("");
  const [amenitiesId, setAmenitiesId] = useState("");
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState("");
  const [rangeKm, setRangeKm] = useState("");
  const [limiteDailyKm, setLimiteDailyKm] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [sale, setSale] = useState("");
  const [electricityFee, setElectricityFee] = useState("");
  const [overageFee, setOverageFee] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setModelName(initialData?.modelName ?? "");
      setManufacturerCarId(initialData?.manufacturerCarId ? String(initialData.manufacturerCarId) : "");
      setAmenitiesId(initialData?.amenitiesId ? String(initialData.amenitiesId) : "");
      setBatteryCapacityKwh(initialData?.batteryCapacityKwh ?? "");
      setRangeKm(initialData?.rangeKm ?? "");
      setLimiteDailyKm(initialData?.limiteDailyKm ?? "");
      setSeats(initialData?.seats ?? "");
      setPrice(initialData?.price ? String(initialData.price) : "");
      setSale(initialData?.sale ? String(initialData.sale) : "");
      setElectricityFee(initialData?.electricityFee ?? "");
      setOverageFee(initialData?.overageFee ?? "");
      setImage(initialData?.image ?? "");
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim() || !manufacturerCarId || !amenitiesId) return;
    try {
      setSubmitting(true);
      await onSubmit({
        modelName: modelName.trim(),
        manufacturerCarId,
        amenitiesId,
        batteryCapacityKwh: batteryCapacityKwh.trim(),
        rangeKm: rangeKm.trim(),
        limiteDailyKm: limiteDailyKm.trim(),
        seats: seats.trim(),
        price: Number(price) || 0,
        sale: Number(sale) || 0,
        electricityFee: electricityFee.trim(),
        overageFee: overageFee.trim(),
        image: image.trim(),
        isDeleted: false,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? "Sửa model xe" : "Thêm model xe"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="modelName">
                Tên model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modelName"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Nhập tên model xe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manufacturerCarId">
                Nhà sản xuất <span className="text-red-500">*</span>
              </Label>
              <Select value={manufacturerCarId} onValueChange={setManufacturerCarId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhà sản xuất" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amenitiesId">
              Tiện nghi <span className="text-red-500">*</span>
            </Label>
            <Select value={amenitiesId} onValueChange={setAmenitiesId} required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tiện nghi" />
              </SelectTrigger>
              <SelectContent>
                {amenities.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="batteryCapacityKwh">
                Dung lượng pin (kWh) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="batteryCapacityKwh"
                value={batteryCapacityKwh}
                onChange={(e) => setBatteryCapacityKwh(e.target.value)}
                placeholder="Nhập dung lượng pin"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rangeKm">
                Tầm hoạt động (km) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rangeKm"
                value={rangeKm}
                onChange={(e) => setRangeKm(e.target.value)}
                placeholder="Nhập tầm hoạt động"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limiteDailyKm">
                Giới hạn km/ngày <span className="text-red-500">*</span>
              </Label>
              <Input
                id="limiteDailyKm"
                value={limiteDailyKm}
                onChange={(e) => setLimiteDailyKm(e.target.value)}
                placeholder="Nhập giới hạn km/ngày"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="seats">
                Số ghế <span className="text-red-500">*</span>
              </Label>
              <Input
                id="seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="Nhập số ghế"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">
                Giá thuê <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá thuê"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sale">Giảm giá (%)</Label>
              <Input
                id="sale"
                type="number"
                value={sale}
                onChange={(e) => setSale(e.target.value)}
                placeholder="Nhập phần trăm giảm giá"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="electricityFee">
                Phí điện <span className="text-red-500">*</span>
              </Label>
              <Input
                id="electricityFee"
                type="number"
                value={electricityFee}
                onChange={(e) => setElectricityFee(e.target.value)}
                placeholder="Nhập phí điện"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="overageFee">
                Phí vượt km <span className="text-red-500">*</span>
              </Label>
              <Input
                id="overageFee"
                type="number"
                value={overageFee}
                onChange={(e) => setOverageFee(e.target.value)}
                placeholder="Nhập phí vượt km"
                required
              />
            </div>
          </div>

          <ImageUploader value={image} onChange={setImage} />

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

export default ModelFormDialog;

