import { useMemo, useState } from "react";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";
import { vnd } from "@/lib/utils/currency";
import type { Model } from "@/@types/car/model";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DepotLite = {
  id: string;
  name: string;
  province?: string;
  district?: string;
  street?: string;
};

type Props = {
  car: Model;
  searchForm: { location: string; start: string; end: string };
  depotId?: string;
  depots?: DepotLite[];
  onTimeChange?: (start: string, end: string) => void;
};

export default function PaymentSection({
  car,
  searchForm,
  depotId,
  depots,
  onTimeChange,
}: Props) {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempStart, setTempStart] = useState(searchForm.start);
  const [tempEnd, setTempEnd] = useState(searchForm.end);

  const { days, baseTotal, deposit, salePrice } = useBookingCalc(
    car.price,
    searchForm.start,
    searchForm.end,
    car.sale
  );

  const depot = useMemo(
    () => (depots ?? []).find((d) => d.id === depotId),
    [depots, depotId]
  );

  const handleSaveTime = () => {
    if (onTimeChange) {
      onTimeChange(tempStart, tempEnd);
    }
    setIsEditingTime(false);
  };

  const handleOpenEdit = () => {
    setTempStart(searchForm.start);
    setTempEnd(searchForm.end);
    setIsEditingTime(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-lg">{car.modelName}</div>
        </div>
        {car.image && (
          <img
            src={car.image}
            alt={car.modelName}
            className="w-60 h-40 object-cover rounded-lg"
          />
        )}
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium text-gray-900">
            {depot?.province || searchForm.location}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenEdit}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <Clock className="h-4 w-4 mr-1" />
            Sửa thời gian
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {days} ngày •{" "}
          {new Date(searchForm.start).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          {" → "}
          {new Date(searchForm.end).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        {depot && (
          <div className="text-sm text-gray-700 mt-2">
            {depot.name} — {depot.street}, {depot.district}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Bảng kê chi tiết</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cước phí niêm yết</span>
            <span className="text-sm">
              {car.sale && car.sale > 0 ? (
                <div className="text-sm">
                  <span className="line-through text-gray-400 mr-2">
                    {vnd(car.price)}₫
                  </span>
                  <span className="text-red-600 font-medium">
                    {vnd(salePrice)}₫ (-{car.sale}%)
                  </span>
                </div>
              ) : (
                <span className="text-sm">{vnd(car.sale)}₫</span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-medium">Tổng tiền</span>
            <span className="font-medium">{vnd(baseTotal)}₫</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Tiền đặt cọc(30%)</span>
            <span className="font-medium">{vnd(deposit)}₫</span>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-gray-600">Thanh toán*</span>
            <span className="text-emerald-600 font-bold text-xl">
              {vnd(deposit)}₫
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400">*Giá thuê xe đã bao gồm VAT.</p>
      </div>

      {/* Edit Time Dialog */}
      <Dialog open={isEditingTime} onOpenChange={setIsEditingTime}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thời gian thuê xe</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Thời gian bắt đầu</Label>
              <Input
                id="start-time"
                type="datetime-local"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">Thời gian kết thúc</Label>
              <Input
                id="end-time"
                type="datetime-local"
                value={tempEnd}
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 Thời gian thuê tối thiểu là 1 ngày
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditingTime(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveTime}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Lưu thay đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
