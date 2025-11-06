import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { CarEV, CarEVRequest } from "@/@types/car/carEv";
import type { CarEvStatus } from "@/@types/enum";
import { carEVAPI } from "@/apis/car-ev.api";

interface UpdateCarDialogProps {
  car: CarEV | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CAR_STATUS_OPTIONS: { value: CarEvStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Sẵn sàng" },
  { value: "UNAVAILABLE", label: "Không khả dụng" },
  { value: "RESERVED", label: "Đã đặt trước" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "REPAIRING", label: "Đang sửa chữa" },
];

export default function UpdateCarDialog({
  car,
  open,
  onOpenChange,
  onSuccess,
}: UpdateCarDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CarEVRequest>({
    modelId: "",
    depotId: "",
    licensePlate: "",
    batteryHealthPercentage: "",
    status: "AVAILABLE",
  });

  const [errors, setErrors] = useState<{
    licensePlate?: string;
    batteryHealthPercentage?: string;
  }>({});

  // Load car data when dialog opens
  useEffect(() => {
    if (car && open) {
      setFormData({
        modelId: car.modelId,
        depotId: car.depotId,
        licensePlate: car.licensePlate,
        batteryHealthPercentage: car.batteryHealthPercentage,
        status: car.status,
      });
      setErrors({});
    }
  }, [car, open]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = "Vui lòng nhập biển số xe";
    }

    const batteryHealth = parseFloat(formData.batteryHealthPercentage);
    if (isNaN(batteryHealth) || batteryHealth < 0 || batteryHealth > 100) {
      newErrors.batteryHealthPercentage = "Sức khỏe pin phải từ 0 đến 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!car) return;

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    // Debug: Check car object

    // Ensure modelId and depotId are included
    const payload: CarEVRequest = {
      modelId: car.modelId || car.model?.id || "",
      depotId: car.depotId || car.depot?.id || "",
      licensePlate: formData.licensePlate,
      batteryHealthPercentage: formData.batteryHealthPercentage,
      status: formData.status,
    };

    setLoading(true);
    try {
      await carEVAPI.update(car.id, payload);
      toast.success("Cập nhật thông tin xe thành công!");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Update car error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin xe</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết của xe {car.licensePlate}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* License Plate */}
          <div className="space-y-2">
            <Label htmlFor="licensePlate">
              Biển số xe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  licensePlate: e.target.value,
                }))
              }
              placeholder="Ví dụ: 29A-12345"
              className={errors.licensePlate ? "border-red-500" : ""}
            />
            {errors.licensePlate && (
              <p className="text-red-500 text-sm">{errors.licensePlate}</p>
            )}
          </div>

          {/* Model Name (Read-only) */}
          <div className="space-y-2">
            <Label>Mẫu xe</Label>
            <Input value={car.model?.modelName || "N/A"} disabled />
            <p className="text-sm text-gray-500">Không thể thay đổi mẫu xe</p>
          </div>

          {/* Depot (Read-only) */}
          <div className="space-y-2">
            <Label>Chi nhánh</Label>
            <Input value={car.depot?.name || "N/A"} disabled />
          </div>

          {/* Battery Health */}
          <div className="space-y-2">
            <Label htmlFor="batteryHealth">
              Sức khỏe pin (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="batteryHealth"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.batteryHealthPercentage}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  batteryHealthPercentage: e.target.value,
                }))
              }
              placeholder="0 - 100"
              className={errors.batteryHealthPercentage ? "border-red-500" : ""}
            />
            {errors.batteryHealthPercentage && (
              <p className="text-red-500 text-sm">
                {errors.batteryHealthPercentage}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Trạng thái <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: CarEvStatus) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {CAR_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
