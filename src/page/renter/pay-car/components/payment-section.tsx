import { useState, useEffect } from "react";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";
import { vnd } from "@/lib/utils/currency";
import type { Model } from "@/@types/car/model";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { SystemConfigUtils } from "@/hooks/use-system-config";
import { MembershipAPI } from "@/apis/membership.api";

import DatePicker, {
  type DateRange,
} from "../../search-car/components/date-picker";

type DepotLite = {
  id: string;
  name: string;
  province?: string;
  district?: string;
  street?: string;
  openTime: string;
  closeTime: string;
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
  onTimeChange,
}: Props) {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [membershipDiscount, setMembershipDiscount] = useState(0);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: searchForm.start.slice(0, 10),
    endDate: searchForm.end.slice(0, 10),
    startTime: searchForm.start.slice(11, 16),
    endTime: searchForm.end.slice(11, 16),
  });

  // Fetch membership discount
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const membership = await MembershipAPI.getMyMembership();
        setMembershipDiscount(membership.discountPercent || 0);
      } catch (error) {
        console.error("Failed to fetch membership:", error);
        setMembershipDiscount(0);
      }
    };
    fetchMembership();
  }, []);

  const { baseTotal, deposit, salePrice, shiftLabel } = useBookingCalc(
    car.price,
    searchForm.start,
    searchForm.end,
    car.sale,
    membershipDiscount
  );

  const systemDepositPercent = SystemConfigUtils.getDepositPercent();

  const getShiftDescription = (): string => {
    // Use the label from hook directly
    return shiftLabel;
  };
  const handleDateRangeChange = (newRange: DateRange) => {
    // Chỉ update state, không đóng dialog
    setDateRange(newRange);
  };

  const handleClosePicker = (open: boolean) => {
    if (!open) {
      // Khi đóng dialog, apply changes
      if (onTimeChange) {
        const newStart = `${dateRange.startDate}T${dateRange.startTime}`;
        const newEnd = `${dateRange.endDate}T${dateRange.endTime}`;
        onTimeChange(newStart, newEnd);
      }
    }
    setIsEditingTime(open);
  };

  const handleOpenEdit = () => {
    // Sync current searchForm to dateRange when opening
    setDateRange({
      startDate: searchForm.start.slice(0, 10),
      endDate: searchForm.end.slice(0, 10),
      startTime: searchForm.start.slice(11, 16),
      endTime: searchForm.end.slice(11, 16),
    });
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

      <div className="bg-white rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Thời gian thuê</h3>
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

        <div className="space-y-2 text-sm">
          <div className="flex items-start justify-between">
            <span className="text-gray-600">Bắt đầu:</span>
            <span className="text-gray-900 font-medium text-right">
              {new Date(searchForm.start).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-gray-600">Kết thúc:</span>
            <span className="text-gray-900 font-medium text-right">
              {new Date(searchForm.end).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-start justify-between border-t pt-2">
            <span className="text-gray-600">
              {(() => {
                const startDate = new Date(searchForm.start);
                const endDate = new Date(searchForm.end);
                const totalHours =
                  (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
                return totalHours > 24 ? "Thời lượng thuê:" : "Ca thuê:";
              })()}
            </span>
            <span className="text-gray-900 font-medium text-right">
              {getShiftDescription()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Bảng giá áp dụng</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Giá thuê theo ngày</span>
            <span className="text-sm">
              {car.sale && car.sale > 0 ? (
                <div className="text-sm">
                  <span className="line-through text-gray-400 mr-2">
                    {vnd(car.price)}đ/ngày
                  </span>
                  <span className="text-red-600 font-medium">
                    {vnd(Math.round(car.price * (1 - car.sale / 100)))}đ/ngày (-
                    {car.sale}%)
                  </span>
                </div>
              ) : (
                <span className="text-sm">{vnd(car.price)}đ/ngày</span>
              )}
            </span>
          </div>

          {membershipDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Giảm giá Membership</span>
              <span className="text-sm text-emerald-600 font-medium">
                -{membershipDiscount}%
              </span>
            </div>
          )}

          {(car.sale > 0 || membershipDiscount > 0) && (
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-900">
                Giá sau giảm
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {vnd(salePrice)}đ/ngày
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Bảng kê chi tiết</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Thời lượng thuê: {getShiftDescription()}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-medium">Tổng tiền</span>
            <span className="font-medium">{vnd(baseTotal)}₫</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">
              Tiền đặt cọc ({systemDepositPercent}%)
            </span>
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
      <DatePicker
        open={isEditingTime}
        onOpenChange={handleClosePicker}
        value={dateRange}
        onChange={handleDateRangeChange}
        title="Chỉnh sửa thời gian thuê"
      />
    </div>
  );
}
