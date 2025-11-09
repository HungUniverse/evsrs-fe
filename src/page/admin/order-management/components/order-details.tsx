import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import AdminDetailPaper from "./detail-paper";
import { TRIP_STATUS_LABEL } from "@/lib/constants/trip-status";
import { OrderDetailsFull } from "./order-details-full";

export default function AdminOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [booking, setBooking] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    console.log("[AdminOrderDetails] Loading order:", orderId);
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await orderBookingAPI.getById(orderId);
        console.log("[AdminOrderDetails] API response:", res);
        setBooking(res.data.data);
      } catch {
        setError("Không tải được chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return <div className="p-6 text-slate-600">Đang tải dữ liệu…</div>;
  }

  if (error || !booking) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-slate-600">Order ID: {orderId}</p>
        {error && <p className="text-red-500 mt-2">Lỗi: {error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 md:p-6">
        <div className="text-lg font-semibold mb-4">Chi tiết đơn hàng</div>

        <div className="rounded-xl bg-sky-100 px-4 py-3 flex items-center justify-between mb-6">
          <div>
            <span className="text-sm">Mã đơn hàng:&nbsp;</span>
            <span className="font-medium tracking-wide">{booking.code}</span>
          </div>
          <span className="text-sm font-medium text-slate-600">
            {TRIP_STATUS_LABEL[booking.status]}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <OrderDetailsFull booking={booking} />
          </div>
          <div>
            <AdminDetailPaper orderId={booking.id} />
          </div>
        </div>
      </section>
    </div>
  );
}

