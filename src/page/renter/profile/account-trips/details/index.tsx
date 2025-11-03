import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { TRIP_STATUS_LABEL } from "@/lib/constants/trip-status";
import DetailInformation from "./components/detail-information";
import DetailPaper from "./components/detail-paper";
import DetailPrice from "./components/detail-price";
import AfterPaymentQR from "./components/AfterPaymentQR";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TripDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [booking, setBooking] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const canCancelBooking = useMemo(() => {
    if (!booking) return false;

    const isPendingOrConfirmed =
      booking.status === "PENDING" || booking.status === "CONFIRMED";
    const startDate = new Date(booking.startAt);
    const now = new Date();
    const isBeforeStartDate = now < startDate;

    return isPendingOrConfirmed && isBeforeStartDate;
  }, [booking]);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderId) return;

    setCancelling(true);
    try {
      await orderBookingAPI.updateStatus(
        orderId,
        "CANCELLED",
        booking?.paymentStatus || "PENDING"
      );
      toast.success("Đã hủy chuyến thuê thành công");
      const res = await orderBookingAPI.getById(orderId);
      setBooking(res.data.data);
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error("Không thể hủy chuyến. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
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

      {/* Cancel Booking Button */}
      {canCancelBooking && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleCancelClick}
            className="hover:bg-red-600 transition-colors"
          >
            Hủy chuyến
          </Button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Xác nhận hủy chuyến
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              Bạn có chắc chắn muốn hủy chuyến thuê này không?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-700">
              Vui lòng đọc chính sách hủy chuyến của chúng tôi{" "}
              <Link
                to="/policies"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
                target="_blank"
              >
                ở đây
              </Link>
              .
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Không, giữ chuyến
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? "Đang hủy..." : "Có, hủy chuyến"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
