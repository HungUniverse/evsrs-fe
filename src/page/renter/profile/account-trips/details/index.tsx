// src/pages/account/components/index.tsx (TripDetails)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { TRIP_STATUS_LABEL } from "@/lib/constants/trip-status";
import DetailInformation from "./components/detail-information";
import DetailPaper from "./components/detail-paper";
import DetailPrice from "./components/detail-price";
import AfterPaymentQR from "./components/AfterPaymentQR";

export default function TripDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [booking, setBooking] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    console.log("[TripDetails] Loading order:", orderId);
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await orderBookingAPI.getById(orderId);

        setBooking(res.data.data);
      } catch (e) {
        console.error("[TripDetails] getById error:", e);
        setError("Không tải được chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    console.log("[TripDetails] Rendering loading state");
    return <div className="p-6 text-slate-600">Đang tải dữ liệu…</div>;
  }
  if (error || !booking) {
    console.log(
      "[TripDetails] Rendering error/not found state. Error:",
      error,
      "Booking:",
      booking
    );
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-slate-600">Order ID: {orderId}</p>
        {error && <p className="text-red-500 mt-2">Lỗi: {error}</p>}
      </div>
    );
  }

  console.log("[TripDetails] Rendering success state with booking:", booking);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 md:p-6">
        <div className="text-lg font-semibold mb-4">Chi tiết đơn hàng</div>

        <div className="rounded-xl bg-sky-100 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-sm">Mã đơn hàng:&nbsp;</span>
            <span className="font-medium tracking-wide">{booking.code}</span>
          </div>
          <span className="text-sm font-medium text-slate-600">
            {TRIP_STATUS_LABEL[booking.status]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          <DetailInformation booking={booking} />
          <DetailPaper orderId={booking.id} />
        </div>
      </section>

      {/* Payment QR for pending orders */}

      <DetailPrice booking={booking} />
      {booking.status === "PENDING" && <AfterPaymentQR orderId={booking.id} />}
    </div>
  );
}
