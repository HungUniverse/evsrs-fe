import { useEffect, useState } from "react";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";
import { vnd } from "@/lib/utils/currency";
import type { CarEV } from "@/@types/car/carEv";
import { MembershipAPI } from "@/apis/membership.api";

interface PricingSummaryProps {
  car: CarEV | null;
  startAt: string;
  endAt: string;
  userId?: string;
}

export function PricingSummary({
  car,
  startAt,
  endAt,
  userId,
}: PricingSummaryProps) {
  const [membershipDiscount, setMembershipDiscount] = useState(0);

  const pricePerDay = car?.model?.price || 0;
  const sale = car?.model?.sale || 0;

  // Fetch membership discount when userId changes
  useEffect(() => {
    const fetchMembership = async () => {
      if (!userId) {
        setMembershipDiscount(0);
        return;
      }

      try {
        const membership = await MembershipAPI.getByUserId(userId);
        setMembershipDiscount(membership.discountPercent || 0);
      } catch (error) {
        console.error("Failed to fetch membership:", error);
        setMembershipDiscount(0);
      }
    };
    fetchMembership();
  }, [userId]);

  const { baseTotal, salePrice, shiftLabel } = useBookingCalc(
    pricePerDay,
    startAt || "",
    endAt || "",
    sale,
    membershipDiscount
  );

  if (!car || !startAt || !endAt) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Chi tiết thanh toán
      </h2>

      {/* Thông tin xe */}
      <div className="bg-white rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Xe</span>
          <span className="font-medium">{car.model?.modelName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Biển số</span>
          <span className="font-medium">{car.licensePlate}</span>
        </div>
      </div>

      {/* Thời gian thuê */}
      <div className="bg-white rounded-lg border p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">Thời gian thuê</h3>

        <div className="flex items-start justify-between">
          <span className="text-sm text-gray-600">Bắt đầu:</span>
          <span className="text-gray-900 font-medium text-right">
            {new Date(startAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-sm text-gray-600">Kết thúc:</span>
          <span className="text-gray-900 font-medium text-right">
            {new Date(endAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-start justify-between border-t pt-2">
          <span className="text-sm text-gray-600">Thời lượng thuê:</span>
          <span className="text-gray-900 font-medium text-right">
            {shiftLabel}
          </span>
        </div>
      </div>

      {/* Bảng giá */}
      <div className="bg-white rounded-lg border p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">Bảng giá áp dụng</h3>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Giá thuê theo ngày</span>
          <span className="text-sm">
            {sale && sale > 0 ? (
              <div className="text-sm text-right">
                <span className="line-through text-gray-400 mr-2">
                  {vnd(pricePerDay)}đ/ngày
                </span>
                <span className="text-red-600 font-medium">
                  {vnd(Math.round(pricePerDay * (1 - sale / 100)))}đ/ngày (-
                  {sale}%)
                </span>
              </div>
            ) : (
              <span className="text-sm">{vnd(pricePerDay)}đ/ngày</span>
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

        {(sale > 0 || membershipDiscount > 0) && (
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

      {/* Tổng kết */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Bảng kê chi tiết</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Thời lượng thuê: {shiftLabel}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-medium">Tổng tiền</span>
            <span className="font-medium">{vnd(baseTotal)}₫</span>
          </div>

          <div className="flex items-center justify-between border-t border-blue-300 pt-2">
            <span className="text-lg font-semibold">Tổng thanh toán</span>
            <span className="text-blue-600 font-bold text-2xl">
              {vnd(baseTotal)}₫
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500">*Giá thuê xe đã bao gồm VAT.</p>
      </div>
    </div>
  );
}
