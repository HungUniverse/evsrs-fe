import { useMemo } from "react";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { HandoverInspection } from "@/@types/order/handover-inspection";

type Props = {
  inspection: HandoverInspection;
  order: OrderBookingDetail;
};

function toVND(value: string) {
  const num = Number(value.replace(/[^\d.-]/g, ""));
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

export default function SettlementViewCustomer({ inspection, order }: Props) {
  const totalAmount = useMemo(() => {
    return order.subTotal;
  }, [order]);

  const duration = useMemo(() => {
    const start = new Date(order.startAt);
    const end = new Date(order.endAt);
    const hours = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    );
    return hours;
  }, [order]);

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Chi phí thuê xe:</h3>
          <div className="space-y-2">
            <p>Tổng thời gian thuê: {duration} giờ</p>
            <p>Giá thuê: {toVND(order.subTotal)} / ngày</p>
            <p className="text-lg font-semibold">
              Tổng cộng: {toVND(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Các ghi chú khác:</h3>
        <p>{inspection.notes || "Không có ghi chú"}</p>
      </div>
    </div>
  );
}
