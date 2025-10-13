import { useMemo } from "react";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";
import { vnd } from "@/lib/utils/currency";
import type { Model } from "@/@types/car/model";

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
};

export default function PaymentSection({
  car,
  searchForm,
  depotId,
  depots,
}: Props) {
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
        <div className="font-medium text-gray-900">
          {depot?.province || searchForm.location}
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
            <span className="font-medium">Tiền đặt cọc</span>
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
    </div>
  );
}
