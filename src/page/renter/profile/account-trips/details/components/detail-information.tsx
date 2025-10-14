import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { fmtDateTime } from "@/hooks/fmt-date-time";

export default function DetailInformation({
  booking,
}: {
  booking: OrderBookingDetail;
}) {
  const customer = booking.user?.userName ?? "—";
  const modelName = booking.carEvs?.model?.modelName ?? "—";
  const depotName = booking.depot?.name ?? "—";

  return (
    <aside className="rounded-xl border bg-white p-4">
      <div className="text-slate-600 text-sm">Tên khách hàng</div>
      <div className="font-medium">{customer}</div>

      <div className="text-slate-600 text-sm mt-3">Xe thuê</div>
      <div className="font-medium">{modelName}</div>

      <div className="text-slate-600 text-sm mt-3">Trạm nhận xe</div>
      <div className="font-medium">{depotName}</div>

      <div className="text-slate-600 text-sm mt-3">Thời gian thuê</div>
      <div className="font-medium">
        {booking.startAt ? fmtDateTime(booking.startAt) : "-"} →{" "}
        {booking.endAt ? fmtDateTime(booking.endAt) : "-"}
      </div>
    </aside>
  );
}
