import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { carEVAPI } from "@/apis/car-ev.api";
import { toast } from "sonner";
import type { CarEV, CarEVRequest } from "@/@types/car/carEv";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import type { CarEvStatus } from "@/@types/enum";
import type { PaginationResponse } from "@/@types/common/pagination";

const statusOptions: Array<{ value: CarEvStatus; label: string }> = [
  { value: "AVAILABLE", label: "Có sẵn" },
  { value: "UNAVAILABLE", label: "Không có sẵn" },
  { value: "RESERVED", label: "Đã đặt" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "REPAIRING", label: "Đang sửa chữa" },
];

interface CarEVFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<CarEV> | null;
  depots: Depot[];
  models: Model[];
  onSubmit: (payload: CarEVRequest) => Promise<void> | void;
}

const CarEVFormDialog: React.FC<CarEVFormDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  depots,
  models,
  onSubmit,
}) => {
  const [modelId, setModelId] = useState("");
  const [depotId, setDepotId] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [batteryHealthPercentage, setBatteryHealthPercentage] = useState("");
  const [status, setStatus] = useState<CarEvStatus>("AVAILABLE");
  const [submitting, setSubmitting] = useState(false);
  const [licensePlateError, setLicensePlateError] = useState("");

  useEffect(() => {
    if (open) {
      // Get modelId from model.id (API returns model object, not modelId)
      const modelIdValue = initialData?.model?.id ? String(initialData.model.id) : "";
      
      // Get depotId from depot.id (API returns depot object, not depotId)
      const depotIdValue = initialData?.depot?.id ? String(initialData.depot.id) : "";
      
      setModelId(modelIdValue);
      setDepotId(depotIdValue);
      setLicensePlate(initialData?.licensePlate ?? "");
      setBatteryHealthPercentage(initialData?.batteryHealthPercentage ?? "");
      // When creating new car, always set status to AVAILABLE; when editing, use initial status
      setStatus(initialData?.id ? (initialData?.status || "AVAILABLE") : "AVAILABLE");
      setLicensePlateError("");
    } else {
      // Reset form when dialog closes
      setModelId("");
      setDepotId("");
      setLicensePlate("");
      setBatteryHealthPercentage("");
      setStatus("AVAILABLE");
      setLicensePlateError("");
    }
  }, [initialData, open]);

  const isEditMode = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelId || !depotId || !licensePlate.trim() || !batteryHealthPercentage.trim()) return;
    
    // Check for duplicate license plate when creating new car (not editing)
    if (!isEditMode) {
      try {
        setSubmitting(true);
        setLicensePlateError("");
        
        // Fetch all car EVs to check for duplicate license plate
        const res = await carEVAPI.getAll({ pageNumber: 1, pageSize: 9999 });
        const payload = res.data as PaginationResponse<CarEV>;
        const allCarEVs = payload.items || [];
        
        const trimmedLicensePlate = licensePlate.trim();
        const isDuplicate = allCarEVs.some(
          (car) => car.licensePlate?.trim().toLowerCase() === trimmedLicensePlate.toLowerCase()
        );
        
        if (isDuplicate) {
          setLicensePlateError("Biển số xe này đã tồn tại trong hệ thống");
          toast.error("Biển số xe này đã tồn tại trong hệ thống");
          setSubmitting(false);
          return;
        }
        
        // No duplicate found, proceed with submission
        await onSubmit({
          modelId,
          depotId,
          licensePlate: trimmedLicensePlate,
          batteryHealthPercentage: batteryHealthPercentage.trim(),
          status,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Error checking license plate:", error);
        toast.error("Có lỗi xảy ra khi kiểm tra biển số xe");
      } finally {
        setSubmitting(false);
      }
    } else {
      // Edit mode - check for duplicate license plate (excluding current car)
      try {
        setSubmitting(true);
        setLicensePlateError("");
        
        // Fetch all car EVs to check for duplicate license plate
        const res = await carEVAPI.getAll({ pageNumber: 1, pageSize: 9999 });
        const payload = res.data as PaginationResponse<CarEV>;
        const allCarEVs = payload.items || [];
        
        const trimmedLicensePlate = licensePlate.trim();
        const currentCarId = initialData?.id;
        
        // Check if license plate is duplicate with other cars (excluding current car)
        const isDuplicate = allCarEVs.some(
          (car) => 
            car.id !== currentCarId && 
            car.licensePlate?.trim().toLowerCase() === trimmedLicensePlate.toLowerCase()
        );
        
        if (isDuplicate) {
          setLicensePlateError("Biển số xe này đã tồn tại trong hệ thống");
          toast.error("Biển số xe này đã tồn tại trong hệ thống");
          setSubmitting(false);
          return;
        }
        
        // No duplicate found, proceed with submission
        await onSubmit({
          modelId,
          depotId,
          licensePlate: trimmedLicensePlate,
          batteryHealthPercentage: batteryHealthPercentage.trim(),
          status,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Error checking license plate:", error);
        toast.error("Có lỗi xảy ra khi kiểm tra biển số xe");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditMode ? "Sửa xe điện" : "Thêm xe điện mới"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Thay đổi thông tin xe điện tại đây. Nhấn lưu khi bạn hoàn thành."
              : "Thêm mới một xe điện vào hệ thống. Điền đầy đủ các trường bắt buộc."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="modelId">
                Model xe <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={modelId} onValueChange={setModelId} disabled={isEditMode} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn model xe" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Depot Selection */}
            <div className="space-y-2">
              <Label htmlFor="depotId">
                Trạm xe điện <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={depotId} onValueChange={setDepotId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạm xe điện" />
                </SelectTrigger>
                <SelectContent>
                  {depots.map((depot) => (
                    <SelectItem key={depot.id} value={depot.id}>
                      {depot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate">
                Biển số xe <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="licensePlate"
                placeholder="Nhập biển số xe"
                value={licensePlate}
                onChange={(e) => {
                  setLicensePlate(e.target.value);
                  setLicensePlateError("");
                }}
                required
                className={licensePlateError ? "border-red-500" : ""}
              />
              {licensePlateError && (
                <p className="text-sm text-red-500">{licensePlateError}</p>
              )}
            </div>

            {/* Battery Health */}
            <div className="space-y-2">
              <Label htmlFor="batteryHealthPercentage">
                Tình trạng pin (%) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="batteryHealthPercentage"
                type="number"
                min="0"
                max="100"
                placeholder="Nhập tình trạng pin (0-100)"
                value={batteryHealthPercentage}
                onChange={(e) => setBatteryHealthPercentage(e.target.value)}
                onKeyDown={(e) => ['e', 'E'].includes(e.key) && e.preventDefault()}
                required
              />
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={status} onValueChange={(v) => setStatus(v as CarEvStatus)} disabled={!isEditMode} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default CarEVFormDialog;

